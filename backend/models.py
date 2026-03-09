from typing import Optional, List
from datetime import date
from pydantic import BaseModel, EmailStr, Field

class EmployeeBase(BaseModel):
    employee_id: str = Field(..., example="EMP001", description="Unique Employee ID")
    full_name: str = Field(..., example="John Doe")
    email: EmailStr = Field(..., example="john.doe@example.com")
    department: str = Field(..., example="Engineering")

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: str = Field(alias="_id")
    
    class Config:
        populate_by_name = True

class AttendanceBase(BaseModel):
    employee_id: str = Field(..., example="EMP001")
    date: str = Field(..., example="2023-10-25", description="ISO format date string")
    status: str = Field(..., example="Present", description="Must be Present or Absent")

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: str = Field(alias="_id")
    
    class Config:
        populate_by_name = True
