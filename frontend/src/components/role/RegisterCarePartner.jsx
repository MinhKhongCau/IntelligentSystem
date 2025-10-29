import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './RegisterCarePartner.css'; // <--- 1. IMPORT TỆP CSS

const RegisterCarePartner = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [formData, setFormData] = useState({
        id: user.id,
        partnerType: "",
        organizationName: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        // console.log(formData)

        try {
            const response = await axios.post("/api/care-partners/register", formData);
            if (response.status === 201) {
                setSuccess("Successfully registered as a Care Partner!");
                // Optionally redirect after a delay
                setTimeout(() => {
                    navigate("/dashboard"); // or any other appropriate page
                }, 2000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);
        }
    };

    return (
        // 2. THÊM LỚP BỌC BÊN NGOÀI
        <div className="register-partner-wrapper"> 
            {/* THÊM LỚP CSS TÙY CHỈNH VÀO CONTAINER CÓ SẴN */}
            <div className="container mt-5 register-partner-container"> 
                <h2>Register as a Care Partner</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="p-4 mb-4 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg shadow dark:bg-red-lert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <div className="mb-3 flex justify-between">
                        <label htmlFor="partnerType" className="form-label">Position / Role</label>
                        <input
                            type="text"
                            className="form-control"
                            id="partnerType"
                            name="partnerType"
                            value={formData.partnerType}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3 flex justify-between">
                        <label htmlFor="organizationName" className="form-label">Organization Name</label>
                        <input type="text" className="form-control" id="organizationName" name="organizationName" value={formData.organizationName} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        </div>
    );
}
export default RegisterCarePartner;