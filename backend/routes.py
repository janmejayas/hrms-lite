from fastapi import APIRouter, Body, HTTPException, status
from models import EmployeeCreate, Employee, AttendanceCreate, Attendance
from database import employee_collection, attendance_collection
from typing import List
from pymongo.errors import DuplicateKeyError
from bson import ObjectId

router = APIRouter()


@router.post("/employees", response_description="Add new employee", status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate = Body(...)):
    employee_dict = employee.model_dump()
    try:
        new_employee = await employee_collection.insert_one(employee_dict)
        created_employee = await employee_collection.find_one({"_id": new_employee.inserted_id})
        created_employee["_id"] = str(created_employee["_id"])
        return created_employee
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Employee ID already exists")

@router.get("/employees", response_description="List all employees")
async def list_employees():
    employees = await employee_collection.find().to_list(1000)
    for emp in employees:
        emp["_id"] = str(emp["_id"])
    return employees

@router.delete("/employees/{employee_id}", response_description="Delete an employee")
async def delete_employee(employee_id: str):
    delete_result = await employee_collection.delete_one({"employee_id": employee_id})
    if delete_result.deleted_count == 1:
        await attendance_collection.delete_many({"employee_id": employee_id})
        return {"status": "success", "message": f"Employee {employee_id} deleted."}
    raise HTTPException(status_code=404, detail=f"Employee {employee_id} not found")


@router.post("/attendance", response_description="Mark attendance", status_code=status.HTTP_201_CREATED)
async def mark_attendance(attendance: AttendanceCreate = Body(...)):
    if attendance.status not in ["Present", "Absent"]:
        raise HTTPException(status_code=400, detail="Status must be Present or Absent")
        
    employee = await employee_collection.find_one({"employee_id": attendance.employee_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    attendance_dict = attendance.model_dump()
    try:
        new_att = await attendance_collection.insert_one(attendance_dict)
        created_att = await attendance_collection.find_one({"_id": new_att.inserted_id})
        created_att["_id"] = str(created_att["_id"])
        return created_att
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail=f"Attendance already marked for {attendance.date}")

@router.get("/attendance/{employee_id}", response_description="Get attendance for an employee")
async def get_attendance(employee_id: str):
    employee = await employee_collection.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    records = await attendance_collection.find({"employee_id": employee_id}).sort("date", -1).to_list(100)
    for rec in records:
        rec["_id"] = str(rec["_id"])
    return records


@router.get("/dashboard/summary", response_description="Get dashboard summary")
async def get_dashboard_summary():
    total_employees = await employee_collection.count_documents({})
    
    from datetime import date
    today_str = date.today().isoformat()
    present_today = await attendance_collection.count_documents({"date": today_str, "status": "Present"})
    absent_today = await attendance_collection.count_documents({"date": today_str, "status": "Absent"})
    
    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today
    }
