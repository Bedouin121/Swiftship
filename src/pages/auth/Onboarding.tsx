import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
    Truck,
    Eye,
    EyeOff,
    Mail,
    Lock,
    ArrowRight,
    ArrowLeft,
    User,
    Building2,
    Car,
    Phone,
    MapPin,
    FileText,
    Upload,
    CheckCircle2,
    Briefcase,
    Globe,
    CreditCard,
    Shield,
    Calendar
} from "lucide-react";

type UserType = "customer" | "vendor" | "driver";

interface FormData {
    // Common fields
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    address: string;
    city: string;

    // Vendor specific
    companyName: string;
    businessType: string;
    registrationNumber: string;
    taxId: string;
    website: string;
    businessDescription: string;

    // Driver specific
    nidNumber: string;
    dateOfBirth: string;
    drivingLicense: string;
    licenseExpiry: string;
    vehicleType: string;
    vehicleNumber: string;
    emergencyContact: string;
    emergencyPhone: string;
}

const initialFormData: FormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    companyName: "",
    businessType: "",
    registrationNumber: "",
    taxId: "",
    website: "",
    businessDescription: "",
    nidNumber: "",
    dateOfBirth: "",
    drivingLicense: "",
    licenseExpiry: "",
    vehicleType: "",
    vehicleNumber: "",
    emergencyContact: "",
    emergencyPhone: "",
};

const Onboarding = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState<UserType | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const type = searchParams.get("type") as UserType | null;
        if (type && ["customer", "vendor", "driver"].includes(type)) {
            setUserType(type);
            setStep(2);
        }
    }, [searchParams]);

    const getTotalSteps = () => {
        if (!userType) return 4;
        switch (userType) {
            case "customer": return 3;
            case "vendor": return 4;
            case "driver": return 4;
            default: return 3;
        }
    };

    const getProgress = () => {
        return (step / getTotalSteps()) * 100;
    };

    const updateForm = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        // Simulate registration
        setTimeout(() => {
            setIsLoading(false);
            setStep(getTotalSteps());
        }, 2000);
    };

    const userTypeConfig = {
        customer: {
            icon: User,
            title: "Customer",
            description: "Shop from local vendors and enjoy fast delivery",
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/30",
            textColor: "text-blue-600"
        },
        vendor: {
            icon: Building2,
            title: "Vendor",
            description: "Sell your products and reach more customers",
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/30",
            textColor: "text-purple-600"
        },
        driver: {
            icon: Car,
            title: "Driver",
            description: "Join our fleet and earn on your schedule",
            color: "from-emerald-500 to-teal-500",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/30",
            textColor: "text-emerald-600"
        }
    };

    // Step 1: Choose User Type
    const renderUserTypeSelection = () => (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-3">Join SwiftShift</h2>
                <p className="text-muted-foreground text-lg">Choose how you want to use our platform</p>
            </div>

            <div className="grid gap-4">
                {(Object.keys(userTypeConfig) as UserType[]).map((type) => {
                    const config = userTypeConfig[type];
                    const Icon = config.icon;
                    return (
                        <button
                            key={type}
                            onClick={() => {
                                setUserType(type);
                                setStep(2);
                            }}
                            className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${userType === type
                                    ? `${config.borderColor} ${config.bgColor}`
                                    : "border-border bg-card hover:border-primary/30"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-xl bg-gradient-to-br ${config.color} text-white shadow-lg`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <div className="text-left flex-1">
                                    <h3 className="text-xl font-semibold text-foreground mb-1">{config.title}</h3>
                                    <p className="text-muted-foreground">{config.description}</p>
                                </div>
                                <ArrowRight className={`w-6 h-6 transition-all ${config.textColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-1`} />
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="text-center pt-4">
                <p className="text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );

    // Step 2: Basic Details
    const renderBasicDetails = () => (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Basic Information</h2>
                <p className="text-muted-foreground">Let's start with your personal details</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground font-medium">First Name</Label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => updateForm("firstName", e.target.value)}
                            className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground font-medium">Last Name</Label>
                    <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => updateForm("lastName", e.target.value)}
                        className="h-12 bg-muted/50 border-border focus:border-primary transition-all"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="+880 1XXX-XXXXXX"
                        value={formData.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => updateForm("password", e.target.value)}
                            className="pl-12 pr-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => updateForm("confirmPassword", e.target.value)}
                            className="pl-12 pr-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="text-foreground font-medium">Address</Label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
                    <Textarea
                        id="address"
                        placeholder="Enter your full address"
                        value={formData.address}
                        onChange={(e) => updateForm("address", e.target.value)}
                        className="pl-12 min-h-[80px] bg-muted/50 border-border focus:border-primary transition-all resize-none"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="city" className="text-foreground font-medium">City</Label>
                <Select value={formData.city} onValueChange={(value) => updateForm("city", value)}>
                    <SelectTrigger className="h-12 bg-muted/50 border-border">
                        <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dhaka">Dhaka</SelectItem>
                        <SelectItem value="chittagong">Chittagong</SelectItem>
                        <SelectItem value="sylhet">Sylhet</SelectItem>
                        <SelectItem value="rajshahi">Rajshahi</SelectItem>
                        <SelectItem value="khulna">Khulna</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    // Vendor Step 3: Company Details
    const renderVendorDetails = () => (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Company Details</h2>
                <p className="text-muted-foreground">Tell us about your business</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="companyName" className="text-foreground font-medium">Company Name</Label>
                <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        id="companyName"
                        placeholder="Your Company Ltd."
                        value={formData.companyName}
                        onChange={(e) => updateForm("companyName", e.target.value)}
                        className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-foreground font-medium">Business Type</Label>
                <Select value={formData.businessType} onValueChange={(value) => updateForm("businessType", value)}>
                    <SelectTrigger className="h-12 bg-muted/50 border-border">
                        <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="retail">Retail Store</SelectItem>
                        <SelectItem value="restaurant">Restaurant / Food</SelectItem>
                        <SelectItem value="grocery">Grocery</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="text-foreground font-medium">Business Registration No.</Label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="registrationNumber"
                            placeholder="REG-XXXXX"
                            value={formData.registrationNumber}
                            onChange={(e) => updateForm("registrationNumber", e.target.value)}
                            className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="taxId" className="text-foreground font-medium">Tax ID / TIN</Label>
                    <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="taxId"
                            placeholder="TIN-XXXXX"
                            value={formData.taxId}
                            onChange={(e) => updateForm("taxId", e.target.value)}
                            className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="website" className="text-foreground font-medium">Website (Optional)</Label>
                <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        id="website"
                        type="url"
                        placeholder="https://yourcompany.com"
                        value={formData.website}
                        onChange={(e) => updateForm("website", e.target.value)}
                        className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="businessDescription" className="text-foreground font-medium">Business Description</Label>
                <div className="relative">
                    <Briefcase className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
                    <Textarea
                        id="businessDescription"
                        placeholder="Describe your business, products, and services..."
                        value={formData.businessDescription}
                        onChange={(e) => updateForm("businessDescription", e.target.value)}
                        className="pl-12 min-h-[120px] bg-muted/50 border-border focus:border-primary transition-all resize-none"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="vendorNidNumber" className="text-foreground font-medium">NID Number</Label>
                <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        id="vendorNidNumber"
                        placeholder="1234567890"
                        value={formData.nidNumber}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            updateForm("nidNumber", value);
                        }}
                        className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                        maxLength={10}
                        pattern="[0-9]{10}"
                        required
                    />
                </div>
                {formData.nidNumber && formData.nidNumber.length !== 10 && (
                    <p className="text-sm text-red-500">NID Number must be exactly 10 digits</p>
                )}
            </div>
        </div>
    );

    // Driver Step 3: License & ID Details
    const renderDriverDetails = () => (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Identity & License</h2>
                <p className="text-muted-foreground">We need to verify your identity for security</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nidNumber" className="text-foreground font-medium">NID Number</Label>
                    <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="nidNumber"
                            placeholder="XXXXXXXXXX"
                            value={formData.nidNumber}
                            onChange={(e) => updateForm("nidNumber", e.target.value)}
                            className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-foreground font-medium">Date of Birth</Label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => updateForm("dateOfBirth", e.target.value)}
                            className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="drivingLicense" className="text-foreground font-medium">Driving License No.</Label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="drivingLicense"
                            placeholder="DL-XXXXXXX"
                            value={formData.drivingLicense}
                            onChange={(e) => updateForm("drivingLicense", e.target.value)}
                            className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="licenseExpiry" className="text-foreground font-medium">License Expiry Date</Label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="licenseExpiry"
                            type="date"
                            value={formData.licenseExpiry}
                            onChange={(e) => updateForm("licenseExpiry", e.target.value)}
                            className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">Identity Verification</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Upload clear photos of your NID (both sides) and Driving License
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="border-emerald-500/30 hover:bg-emerald-500/10">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload NID
                            </Button>
                            <Button variant="outline" className="border-emerald-500/30 hover:bg-emerald-500/10">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload License
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Driver Step 4: Vehicle Details
    const renderVehicleDetails = () => (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Vehicle & Emergency Info</h2>
                <p className="text-muted-foreground">Details about your vehicle and emergency contact</p>
            </div>

            <div className="space-y-2">
                <Label className="text-foreground font-medium">Vehicle Type</Label>
                <RadioGroup
                    value={formData.vehicleType}
                    onValueChange={(value) => updateForm("vehicleType", value)}
                    className="grid grid-cols-3 gap-4"
                >
                    {[
                        { value: "bike", label: "Motorcycle", icon: "🏍️" },
                        { value: "car", label: "Car", icon: "🚗" },
                        { value: "van", label: "Van", icon: "🚐" }
                    ].map((option) => (
                        <Label
                            key={option.value}
                            className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 ${formData.vehicleType === option.value
                                    ? "border-primary bg-primary/5"
                                    : "border-border"
                                }`}
                        >
                            <RadioGroupItem value={option.value} className="sr-only" />
                            <span className="text-3xl mb-2">{option.icon}</span>
                            <span className="font-medium">{option.label}</span>
                        </Label>
                    ))}
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label htmlFor="vehicleNumber" className="text-foreground font-medium">Vehicle Registration Number</Label>
                <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        id="vehicleNumber"
                        placeholder="Dhaka Metro-XX-XXXX"
                        value={formData.vehicleNumber}
                        onChange={(e) => updateForm("vehicleNumber", e.target.value)}
                        className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                        required
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-4">Emergency Contact</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="emergencyContact" className="text-foreground font-medium">Contact Name</Label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="emergencyContact"
                                placeholder="Emergency contact name"
                                value={formData.emergencyContact}
                                onChange={(e) => updateForm("emergencyContact", e.target.value)}
                                className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="emergencyPhone" className="text-foreground font-medium">Contact Phone</Label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                id="emergencyPhone"
                                type="tel"
                                placeholder="+880 1XXX-XXXXXX"
                                value={formData.emergencyPhone}
                                onChange={(e) => updateForm("emergencyPhone", e.target.value)}
                                className="pl-12 h-12 bg-muted/50 border-border focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <div className="flex items-start gap-3">
                    <Upload className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-foreground mb-1">Vehicle Documents</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Upload your vehicle registration and insurance documents
                        </p>
                        <Button variant="outline" className="border-emerald-500/30 hover:bg-emerald-500/10">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Documents
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Final Step: Review & Terms
    const renderReviewAndTerms = () => (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Almost Done!</h2>
                <p className="text-muted-foreground">Review your information and accept the terms</p>
            </div>

            {/* Summary Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted border border-border">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Registration Summary
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium text-foreground">{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{formData.email}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium text-foreground">{formData.phone}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Account Type</p>
                        <p className="font-medium text-foreground capitalize">{userType}</p>
                    </div>
                    {userType === "vendor" && formData.companyName && (
                        <div className="col-span-2">
                            <p className="text-muted-foreground">Company</p>
                            <p className="font-medium text-foreground">{formData.companyName}</p>
                        </div>
                    )}
                    {userType === "driver" && formData.vehicleType && (
                        <div>
                            <p className="text-muted-foreground">Vehicle Type</p>
                            <p className="font-medium text-foreground capitalize">{formData.vehicleType}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                    <Checkbox
                        id="terms"
                        checked={agreeTerms}
                        onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                        className="mt-1 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                        I understand that my information will be used to create and manage my SwiftShift account.
                    </Label>
                </div>
            </div>
        </div>
    );

    // Success Screen
    const renderSuccess = () => (
        <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-success to-emerald-400 flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-3">Welcome to SwiftShift!</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Your {userType} account has been created successfully.
                {userType === "vendor" || userType === "driver"
                    ? " We'll review your documents and activate your account within 24-48 hours."
                    : " You can now start exploring our platform."
                }
            </p>

            <div className="space-y-4">
                <Button
                    onClick={() => navigate("/login")}
                    className="px-8 h-12 gradient-primary text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    Continue to Login
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {(userType === "vendor" || userType === "driver") && (
                    <p className="text-sm text-muted-foreground">
                        You'll receive an email once your account is verified
                    </p>
                )}
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        if (step === getTotalSteps() && isLoading === false && step > 1) {
            return renderSuccess();
        }

        if (step === 1) {
            return renderUserTypeSelection();
        }

        if (step === 2) {
            return renderBasicDetails();
        }

        if (userType === "customer" && step === 3) {
            return renderReviewAndTerms();
        }

        if (userType === "vendor") {
            if (step === 3) return renderVendorDetails();
            if (step === 4) return renderReviewAndTerms();
        }

        if (userType === "driver") {
            if (step === 3) return renderDriverDetails();
            if (step === 4) return renderVehicleDetails();
            if (step === 5) return renderReviewAndTerms();
        }

        return null;
    };

    const canProceed = () => {
        if (step === 1) return true;
        if (step === 2) {
            return formData.firstName && formData.lastName && formData.email && formData.phone && formData.password && formData.confirmPassword;
        }
        if (userType === "customer" && step === 3) return agreeTerms;
        if (userType === "vendor") {
            if (step === 3) return formData.companyName && formData.businessType && formData.registrationNumber && formData.nidNumber && formData.nidNumber.length === 10;
            if (step === 4) return agreeTerms;
        }
        if (userType === "driver") {
            if (step === 3) return formData.nidNumber && formData.drivingLicense;
            if (step === 4) return formData.vehicleType && formData.vehicleNumber;
            if (step === 5) return agreeTerms;
        }
        return true;
    };

    const isLastStep = () => {
        if (userType === "customer") return step === 3;
        if (userType === "vendor") return step === 4;
        if (userType === "driver") return step === 5;
        return false;
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* Left Panel - Decorative */}
            <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
                {/* Dynamic gradient based on user type */}
                <div className={`absolute inset-0 bg-gradient-to-br ${userType ? userTypeConfig[userType].color : "from-primary via-secondary to-accent"
                    } transition-all duration-500`}></div>

                {/* Floating elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }}></div>
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px"
                }}></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
                    <Link to="/" className="flex items-center gap-3 mb-12">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Truck className="w-8 h-8" />
                        </div>
                        <span className="text-3xl font-bold">SwiftShift</span>
                    </Link>

                    <div className="space-y-6 max-w-md">
                        <h1 className="text-4xl font-bold leading-tight">
                            {userType ? `Join as a ${userTypeConfig[userType].title}` : "Create Your Account"}
                        </h1>
                        <p className="text-white/80 text-lg leading-relaxed">
                            {userType
                                ? userTypeConfig[userType].description
                                : "Join thousands of users who trust SwiftShift for their delivery needs."
                            }
                        </p>
                    </div>

                    {/* Step indicators */}
                    {step > 1 && (
                        <div className="mt-12 space-y-3 w-full max-w-xs">
                            <div className="flex justify-between text-sm">
                                <span>Step {step - 1} of {getTotalSteps() - 1}</span>
                                <span>{Math.round(((step - 1) / (getTotalSteps() - 1)) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-500"
                                    style={{ width: `${((step - 1) / (getTotalSteps() - 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-3/5 flex items-center justify-center p-6 lg:p-12 bg-background overflow-y-auto">
                <div className="w-full max-w-xl">
                    {/* Mobile header */}
                    <div className="lg:hidden mb-8">
                        <Link to="/" className="flex items-center justify-center gap-3 mb-6">
                            <div className="p-2 gradient-primary rounded-xl text-white">
                                <Truck className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold">SwiftShift</span>
                        </Link>

                        {step > 1 && (
                            <Progress value={getProgress()} className="h-2" />
                        )}
                    </div>

                    {/* Form content */}
                    <div className="animate-fade-in">
                        {renderCurrentStep()}
                    </div>

                    {/* Navigation buttons */}
                    {step > 1 && step < getTotalSteps() && (
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(step - 1)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back
                            </Button>

                            {isLastStep() ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || isLoading}
                                    className="gradient-primary text-white font-semibold px-8 h-12 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Creating Account...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Create Account
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setStep(step + 1)}
                                    disabled={!canProceed()}
                                    className="gradient-primary text-white font-semibold px-8 h-12 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                                >
                                    Continue
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
