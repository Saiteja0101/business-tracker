"use client"
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import { TrendingUp, DollarSign, ChartNoAxesCombined, BriefcaseBusiness, Trash2 } from "lucide-react";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import AddBusinessModal from "./components/AddBusinessModal";
import RemoveBusinessModal from "./components/RemoveBusinessModal";
import SalesExpensesModal from "./components/SalesExpensesModal";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isSalesExpensesModalOpen, setIsSalesExpensesModalOpen] = useState(false)
  const [error, setError] = useState(null)
  const [addBusinessFormData, setAddBusinessFormData] = useState({
    businessName: "",
    initialInvestment: "",
    trackDays: "",
    startDate: ""
  })

  const router = useRouter()

  const handleChange = (e) => {
    setAddBusinessFormData({
      ...addBusinessFormData,
      [e.target.name]: e.target.value
    })
  }

  
  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log(addBusinessFormData);
    
    
    if(!addBusinessFormData.businessName || !addBusinessFormData.initialInvestment || !addBusinessFormData.trackDays || !addBusinessFormData.startDate){
      return alert("All fields are mandatory")
    }
  try {
    const response = await fetch('/api/add-business', {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...addBusinessFormData})
    })

    const data = await response.json()

    if(!response.ok){
      setError(data.message || 'Failed to add data');
      console.log(data.message);
      
      return alert(data.message || "failed to insert")
    }
    router.push('/profit-loss')
    return alert("Business added sucessfully")
  } catch (err) {
    setError(err || "Something went wrong")
    console.log(error);
    
  }
  
}
  return (
    <>
      <Navbar />
      <HeroSection onStartTracking={() => setIsAddModalOpen(true)} />

      {/* Cards Section */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div onClick={() => setIsAddModalOpen(true) } className="cursor-pointer">
            <Card
              icon={<BriefcaseBusiness className="text-blue-600" size={28} />}
              title="Add New Business"
              description="Add new businesses to track."
            />
          </div>
          <div onClick={() => setIsSalesExpensesModalOpen(true)} className="cursor-pointer">
            <Card
              icon={<DollarSign className="text-blue-600" size={28} />}
              title="Sales & Expenses"
              description="Add your today's sales and expenses to track."
            />
          </div>
          <Link href={`/profit-loss`}>
            <Card
              icon={<TrendingUp className="text-blue-600" size={28} />}
              title="Profit / Loss"
              description="Check till now you are in profits or losses."
            />
          </Link>
          <Link href={`/graph-view`}>
            <Card
              icon={<ChartNoAxesCombined className="text-blue-600" size={28} />}
              title="Graph View"
              description="Check your business data in graph view."
            />
          </Link>

          <div onClick={() => setIsRemoveModalOpen(true) } className="cursor-pointer">
            <Card
              icon={<Trash2 className="text-blue-600" size={28} />}
              title="Remove Business"
              description="If tracking is completed, you can remove."
            />
          </div>
        </div>
      </div>

      <Footer />

      {/* IsAddModalForm open */}
      <AddBusinessModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        businessName={addBusinessFormData.businessName}
        initialInvestment={addBusinessFormData.initialInvestment}
        trackDays={addBusinessFormData.trackDays}
        startDate={addBusinessFormData.startDate}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />

      {/* IsAddModalForm open */}
      <RemoveBusinessModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
      />

      {/* IsSalesExpensesModalForm open */}
      <SalesExpensesModal
        isOpen={isSalesExpensesModalOpen}
        onClose={() => setIsSalesExpensesModalOpen(false)}
      />
    </>
  );
}
