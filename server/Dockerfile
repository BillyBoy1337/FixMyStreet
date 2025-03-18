FROM golang:1.23

WORKDIR /app

# Copy Go module files first (better caching)
COPY go.mod go.sum ./
RUN go mod tidy

# Copy the entire project (including custom packages)
COPY . .

# Build the Go binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /docker-gs-ping

EXPOSE 8080

CMD ["/docker-gs-ping"]
