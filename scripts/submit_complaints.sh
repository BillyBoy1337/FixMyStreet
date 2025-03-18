#!/usr/bin/env bash

# Give permission to execute the script
# chmod +x submit_complaints.sh
# Run the script
# ./submit_complaints.sh

# Define the API endpoint
# Choose the URL based on argument
PROD_URL="http://20.39.248.149/api/complaints/create"  #production URL
LOCAL_URL="http://localhost:8080/api/complaints/create"   #local URL


if [ "$1" == "1" ]; then
    API_ENDPOINT="$PROD_URL"
    echo "Using production URL: $API_ENDPOINT"
else
    API_ENDPOINT="$LOCAL_URL"
    echo "Using local URL: $API_ENDPOINT"
fi

# Define the Bearer token
BEARER_TOKEN="TOKEN" #replace TOKEN with the actual token get it by running login.sh script (chmod +x login.sh && ./login.sh )

# Define image directory
IMAGE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/images"

# Complaints with fixed image paths
declare -A complaints
complaints["Road Issues|A large pothole on the main road causing traffic issues.|Greenfield|MG Road|28.6139|77.2090|Dangerous Pothole Near Bus Stop"]="$IMAGE_DIR/1.png"
complaints["Street Lighting|The streetlight near the main market has been broken for weeks, making the area unsafe at night.|Springfield|High Street|40.7128|-74.0060|Dark Streets Due to Broken Light"]="$IMAGE_DIR/4.png"
complaints["Waste Management|The garbage bin near the school is overflowing, causing a foul smell and attracting stray animals.|Oakwood|Elm Street|34.0522|-118.2437|Overflowing Trash Bin Needs Immediate Attention"]="$IMAGE_DIR/5.png"
complaints["Water Supply|A major water pipeline is leaking near the community center, wasting thousands of liters of water daily.|Riverdale|Park Avenue|35.6895|139.6917|Severe Water Leakage Near Community Center"]="$IMAGE_DIR/6.png"
complaints["Environmental Concerns|A large tree has fallen across the road, blocking traffic and causing inconvenience to commuters.|Maplewood|Birch Lane|51.5074|-0.1278|Fallen Tree Blocking Main Road"]="$IMAGE_DIR/7.png"
complaints["Public Safety|An uncovered manhole near the bus station is a safety hazard for pedestrians and vehicles.|Downtown|Main Street|41.8781|-87.6298|Uncovered Manhole Poses Danger"]="$IMAGE_DIR/9.png"
complaints["Road Issues|The traffic light at the busy intersection is not working, causing traffic jams and accidents.|Westwood|Cross Junction|48.8566|2.3522|Faulty Traffic Signal at Junction"]="$IMAGE_DIR/10.png"
complaints["Public Safety|A public bench in the park is broken, making it unsafe for visitors, especially the elderly.|Sunnyvale|Garden Street|52.5200|13.4050|Damaged Public Bench Needs Replacement"]="$IMAGE_DIR/11.png"
complaints["Environmental Concerns|People are illegally dumping construction debris near the lake, harming the environment.|Lakeview|Shore Road|45.4215|-75.6972|Illegal Waste Dumping Polluting the Area"]="$IMAGE_DIR/12.png"
complaints["Waste Management|Sewage water is overflowing onto the street, causing a bad odor and health risks.|Brookside|Riverside Drive|19.0760|72.8777|Sewage Overflow Creating Unhygienic Conditions"]="$IMAGE_DIR/13.png"
complaints["Other|Walls of the railway station are covered in graffiti, making the area look unpleasant.|Metropolis|Station Road|40.4168|-3.7038|Public Property Defaced with Graffiti"]="$IMAGE_DIR/14.png"
complaints["Public Safety|An abandoned car has been left on the roadside for months, blocking parking space.|Sunset Park|5th Avenue|34.6937|135.5023|Abandoned Car Blocking Traffic Flow"]="$IMAGE_DIR/15.png"
complaints["Public Transport|The roof of the bus stop shelter is broken, leaving passengers exposed to rain and sun.|Silverwood|Transit Lane|55.7558|37.6173|Bus Stop Shelter in Need of Repair"]="$IMAGE_DIR/16.png"
complaints["Environmental Concerns|The sidewalks are overgrown with bushes, making it difficult for pedestrians to walk safely.|Evergreen|Oak Street|37.7749|-122.4194|Overgrown Sidewalks Need Maintenance"]="$IMAGE_DIR/17.png"
complaints["Water Supply|Water is accumulating on the roadside due to poor drainage, creating a mosquito breeding ground.|Hilltown|Main Road|32.7767|-96.7970|Stagnant Water Creating Mosquito Problems"]="$IMAGE_DIR/18.png"
complaints["Electricity|An electric pole is leaning dangerously, posing a serious risk of falling.|Suburbia|Power Line Street|29.7604|-95.3698|Leaning Electric Pole Needs Immediate Attention"]="$IMAGE_DIR/19.png"


# Loop through complaints and send API requests
for complaint in "${!complaints[@]}"; do
    # Extract complaint details
    IFS='|' read -r CATEGORY DESCRIPTION VILLAGE STREET LAT LNG TITLE <<< "$complaint"

    # Get the assigned image path
    IMAGE_PATH="${complaints[$complaint]}"

    # Check if the image exists, otherwise use a default image
    if [[ ! -f "$IMAGE_PATH" ]]; then
        IMAGE_PATH="$IMAGE_DIR/default.png"
    fi

    # Send POST request
    RESPONSE=$(curl -X POST "$API_ENDPOINT" \
        -H "Authorization: Bearer $BEARER_TOKEN" \
        -H "Content-Type: multipart/form-data" \
        -F "category=$CATEGORY" \
        -F "description=$DESCRIPTION" \
        -F "village=$VILLAGE" \
        -F "street=$STREET" \
        -F "lat=$LAT" \
        -F "lng=$LNG" \
        -F "title=$TITLE" \
        -F "image=@$IMAGE_PATH")

    # Print server response
    echo "Server Response for '$TITLE': $RESPONSE"
done
