import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown } from "react-bootstrap";
import salary from "../Images/salary.jpg";
import viewproduct from "../Images/viewproduct.jpg";
import manageproduct from "../Images/manageproduct.jpg";



const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center gap-16 p-6 pt-2">
      
     {/* Billing Card */}
      <div className="max-w-sm bg-white border border-blue-500 rounded-lg shadow-sm">
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold">Calcuate Bill</h5>
          <img
            src={salary}
            alt="View Attendance"
            className="w-full h-40 object-cover mb-3"
          />
          <Button onClick={() => navigate("/calcbill")}>
            Calcuate Bill
          </Button>
        </div>
      </div>

      {/* view product Card */}
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold">View Products</h5>
          <img
            src={viewproduct}
            alt="View Products"
            className="w-full h-40 object-cover mb-3"
          />
          <Button onClick={() => navigate("/viewproducts")}>
         View Products
          </Button>
        </div>
      </div>
      
     
      {/* Manage Products Card with Dropdown */}
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold">Manage Products</h5>
          <img
            src={manageproduct}
            alt="Manage Products"
            className="w-full h-40 object-cover mb-3"
          />
          <Dropdown>
            <Dropdown.Toggle variant="primary">Manage Products</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate("/productedit")}>
                Edit Products
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/productadd")}>
                Add New Products
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
