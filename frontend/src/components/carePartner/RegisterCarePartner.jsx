import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

        try {
            const response = await axios.post("/api/care-partners/register", formData);
            if (response.status === 201) {
                setSuccess("Successfully registered as a Care Partner!");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
            setError(errorMessage);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[90vh] bg-gray-50 px-4 py-8">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg border border-gray-200 p-10">
                <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
                    Register as a Care Partner
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg shadow">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="p-4 text-center bg-green-100 border border-green-400 text-green-700 rounded-lg shadow">
                            {success}
                        </div>
                    )}
                    
                    <div>
                        <label 
                            htmlFor="partnerType" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Position / Role
                        </label>
                        <input
                            type="text"
                            id="partnerType"
                            name="partnerType"
                            value={formData.partnerType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your position or role"
                        />
                    </div>
                    
                    <div>
                        <label 
                            htmlFor="organizationName" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Organization Name
                        </label>
                        <input
                            type="text"
                            id="organizationName"
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your organization name"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterCarePartner;