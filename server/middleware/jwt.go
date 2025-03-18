package middleware

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/spf13/viper"
)

var (
	jwtExpirationLong  int
	jwtExpirationShort int
	signingKey         []byte
)

type CustomClaims struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
	jwt.StandardClaims
}

func init() {
	jwtExpirationLong = viper.GetInt("JWT.EXPIRATION.LONG")
	jwtExpirationShort = viper.GetInt("JWT.EXPIRATION.SHORT")
	signingKey = []byte(viper.GetString("JWT.PRIVATE_KEY"))
}

func GenerateToken(userID string, role string, long bool) (string, error) {
	var jwtExpiration int
	if long {
		jwtExpiration = jwtExpirationLong
	} else {
		jwtExpiration = jwtExpirationShort
	}
	if jwtExpiration == 0 {
		jwtExpiration = 60
	}

	claims := CustomClaims{
		userID,
		role,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(jwtExpiration) * time.Minute).Unix(),
			IssuedAt:  jwt.TimeFunc().Unix(),
			Issuer:    "god",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(signingKey)
	return tokenString, err
}

func validateToken(encodedToken string) (string, string, error) {
	// fmt.Println(encodedToken)

	claims := &CustomClaims{}
	_, err := jwt.ParseWithClaims(encodedToken, claims, func(token *jwt.Token) (interface{}, error) {
		if _, isvalid := token.Method.(*jwt.SigningMethodHMAC); !isvalid {
			return nil, fmt.Errorf("invalid token %s", token.Header["alg"])
		}
		return []byte(signingKey), nil
	})

	if err != nil {
		return "", "", err
	}

	return claims.UserID, claims.Role, nil
}
