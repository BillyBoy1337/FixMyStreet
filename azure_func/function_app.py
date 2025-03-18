import azure.functions as func
import logging
import json 
from collections import defaultdict
from datetime import datetime

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

# @app.route(route="createComplaint", methods=["POST"])
# @app.cosmos_db_output(arg_name="documents", 
#                       database_name="fixmystreet",
#                       container_name="complaints",
#                       connection="CosmosDBConnectionString")
# def create_complaint(req: func.HttpRequest, documents: func.Out[func.Document]) -> func.HttpResponse:
#     logging.info('Processing a create complaint request.')

#     try:
#         request_body = req.get_json()
#     except ValueError:
#         return func.HttpResponse(
#             "Invalid JSON",
#             status_code=400
#         )
#     documents.set(func.Document.from_json(json.dumps(request_body)))

#     return func.HttpResponse(
#         "Complaint created successfully.",
#         status_code=201
#     )

@app.route(route="Testing", methods=["GET"])
def get_stats(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing a Test request.')

    stats = {
        "Data": "This is a test data",
        "total_complaints": 100,
        "resolved_complaints": 80,
        "pending_complaints": 20
    }

    return func.HttpResponse(
        json.dumps(stats),
        status_code=200,
        mimetype="application/json"
    )

@app.route(route="GetStats", methods=["GET"])
@app.cosmos_db_input(arg_name="documents", 
                     database_name="fixmystreet",
                     container_name="complaints",
                     connection="CosmosDBConnectionString")
def get_complaints(req: func.HttpRequest, documents: func.DocumentList) -> func.HttpResponse:
    logging.info("Fetching all complaints from Cosmos DB.")

    if not documents:
        return func.HttpResponse("No complaints found.", status_code=404)

    complaints = [json.loads(doc.to_json()) for doc in documents]

    response_data = {
        "total_complaints": len(complaints),
        "complaints_by_status": get_complaints_by_status(complaints),
        "complaints_by_category": get_complaints_by_category(complaints),
        "complaints_by_village": get_complaints_by_village(complaints),
        "all_complaints": complaints
    }

    return func.HttpResponse(
        json.dumps(response_data, indent=2),
        status_code=200,
        mimetype="application/json"
    )

def get_complaints_by_status(complaints):
    status_count = defaultdict(int)
    for complaint in complaints:
        status = complaint.get("status", "Unknown")  # Handle missing status
        status_count[status] += 1
    return dict(status_count)


def get_complaints_by_category(complaints):
    category_count = defaultdict(int)
    for complaint in complaints:
        category = complaint.get("category", "Unknown")
        category_count[category] += 1
    return dict(category_count)

def get_complaints_by_village(complaints):
    village_count = defaultdict(int)
    for complaint in complaints:
        village = complaint.get("village", "Unknown")
        village_count[village] += 1
    return dict(village_count)