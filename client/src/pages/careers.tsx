import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertJobApplicationSchema,
  type JobPosition,
  type InsertJobApplication,
} from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  GraduationCap,
  Users,
  Award,
  DollarSign,
  Stethoscope,
  Home,
  Phone,
  Mail,
  MapPin,
  Menu,
  UserRound,
  Settings,
  FileText,
  Pill,
  Laptop,
  HandHeart,
  Facebook,
  Instagram,
  YoutubeIcon,
} from "lucide-react";

// 👇 EmailJS ko yahan import karo
import emailjs from "@emailjs/browser";

const jobPositions: JobPosition[] = [
  {
    id: "1",
    title: "Staff Nurse",
    department: "Nursing",
    description: "Provide daily patient care, assist doctors, manage wards.",
    responsibilities: [
      "Provide direct patient care and monitoring",
      "Assist physicians during medical procedures",
      "Administer medications and treatments",
      "Maintain accurate patient records",
    ],
    qualifications: [
      "GNM/B.Sc Nursing",
      "Registration with nursing council",
      "Both male and female candidates welcome",
      
    ],
    icon: "UserRound",
   
  },
  {
    id: "2",
    title: "Hospital Administrator",
    department: "Administration",
    description: "Oversee hospital operations, manage staff and resources.",
    responsibilities: [
      "Oversee daily hospital operations",
      "Manage staff schedules and resources",
      "Coordinate with different departments",
      "Ensure compliance with healthcare regulations",
    ],
    qualifications: [
      "Degree in Hospital Management/Administration",
      "3+ years experience preferred",
      "Strong leadership skills",
    ],
    icon: "Settings",
  },
  {
    id: "3",
    title: "Records Clerk",
    department: "Medical Records",
    description: "Maintain patient records, process documentation.",
    responsibilities: [
      "Maintain and organize patient records",
      "Process medical documentation",
      "Ensure data accuracy and confidentiality",
      "Assist with record retrieval requests",
    ],
    qualifications: [
      "Graduation degree required",
      "Knowledge of EHR systems",
      "Attention to detail essential",
    ],
    icon: "FileText",
  },
  {
    id: "4",
    title: "Pharmacist",
    department: "Pharmacy",
    description: "Dispense medications, counsel patients on drug use.",
    responsibilities: [
      "Dispense medications safely and accurately",
      "Counsel patients on proper medication use",
      "Monitor drug interactions and side effects",
      "Maintain pharmacy inventory",
    ],
    qualifications: [
      "B.Pharm or D.Pharm degree",
      "Registration with pharmacy council",
      "Patient counseling experience",
    ],
    icon: "Pill",
  },
  {
    id: "5",
    title: "IT Specialist",
    department: "IT/Support Services",
    description:
      "Manage hospital software, networks, and technical operations.",
    responsibilities: [
      "Maintain hospital IT infrastructure",
      "Support medical software systems",
      "Troubleshoot technical issues",
      "Ensure data security and backup",
    ],
    qualifications: [
      "Graduation in IT/Computer Science",
      "Healthcare IT experience preferred",
      "Network management skills",
    ],
    icon: "Laptop",
  },
  {
    id: "6",
    title: "Medical Social Worker",
    department: "Social Work/Counseling",
    description: "Support patients emotionally, coordinate discharge planning.",
    responsibilities: [
      "Provide emotional support to patients and families",
      "Coordinate discharge planning",
      "Connect patients with community resources",
      "Facilitate communication between medical team and families",
    ],
    qualifications: [
      "MSW or BSW degree",
      "Healthcare social work experience",
      "Strong communication skills",
    ],
    icon: "HandHeart",
  },
];

const getIcon = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    UserRound,
    Settings,
    FileText,
    Pill,
    Laptop,
    HandHeart,
  };
  return iconMap[iconName] || UserRound;
};

function JobCard({
  position,
  onApply,
}: {
  position: JobPosition;
  onApply: (position: JobPosition) => void;
}) {
  const IconComponent = getIcon(position.icon);

  return (
    <Card className="job-card bg-card border border-border rounded-lg p-6 shadow-sm">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`department-badge ${
              position.department === "Nursing" ? "bg-[#064030]" : ""
            } text-white px-3 py-1 rounded-full text-sm font-medium`}
          >
            {position.department}
          </span>
          <IconComponent className="text-2xl text-[#064030]" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          {position.title}
        </h3>
        <p className="text-muted-foreground mb-4">{position.description}</p>

        <div className="mb-4">
          <h4 className="font-semibold text-sm text-foreground mb-2">
            Qualifications Required:
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {position.qualifications.map((qual, index) => (
              <li key={index}>• {qual}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
        <Button 
  onClick={() => onApply(position)}
  className="bg-[#064030] text-white hover:bg-[#052d23] flex-1"
>
  Apply Now
</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border border-border text-muted-foreground hover:bg-secondary"
                data-testid={`button-details-${position.id}`}
              >
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <IconComponent className="w-6 h-6 text-primary" />
                  {position.title} - {position.department}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p className="text-muted-foreground">
                    {position.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Responsibilities</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {position.responsibilities.map((resp, index) => (
                      <li key={index}>• {resp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Qualifications</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    {position.qualifications.map((qual, index) => (
                      <li key={index}>• {qual}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationForm({
  position,
  onClose,
}: {
  position: JobPosition | null;
  onClose: () => void;
}) {
  const { toast } = useToast();

  const form = useForm<any>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      experience: "",
      qualifications: "",
      coverLetter: "",
      resumeFile: null,
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("experience", data.experience);
    formData.append("qualifications", data.qualifications);
    formData.append("coverLetter", data.coverLetter);
    if (data.resumeFile) {
      formData.append("resume", data.resumeFile);
    }

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID", // EmailJS se milega
        "YOUR_TEMPLATE_ID", // EmailJS se milega
        "#jobApplicationForm", // 👈 form ka ID
        "YOUR_PUBLIC_KEY" // EmailJS se milega
      )
      .then(
        () => {
          toast({
            title: "Application Sent",
            description: "Your application has been emailed to HR.",
          });
          form.reset();
          onClose();
        },
        (err) => {
          toast({
            title: "Error",
            description: "Failed to send: " + err.text,
            variant: "destructive",
          });
        }
      );
  };

  if (!position) return null;

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Apply for {position.title}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        {/* 👇 Form ID important hai for EmailJS */}
        <form
          id="jobApplicationForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Experience */}
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2-3 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Qualifications */}
          <FormField
            control={form.control}
            name="qualifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qualifications *</FormLabel>
                <FormControl>
                  <Textarea placeholder="List your qualifications" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Letter */}
          <FormField
            control={form.control}
            name="coverLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Letter</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us why you’re interested"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Resume Upload */}
          <FormField
            control={form.control}
            name="resumeFile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Resume *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Submit Application
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}

export default function Careers() {
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(
    null
  );
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const handleApply = (position: JobPosition) => {
    setSelectedPosition(position);
    setIsApplicationOpen(true);
  };

  const handleCloseApplication = () => {
    setIsApplicationOpen(false);
    setSelectedPosition(null);
  };

  return (
    <div className="bg-background text-foreground">
      {/* Header Navigation */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://www.vardaanhealth.com/Vardaan%20Logo.webp"
                alt="Vardaan Hospital Logo"
                className="h-12 w-auto"
                data-testid="img-logo"
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-foreground">
                  Vardaan Hospital
                </h1>
                <p className="text-sm text-muted-foreground">
                  वरदान! जहाँ देखभाल है सबसे खास
                </p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-home"
              >
                Home
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-about"
              >
                About
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-services"
              >
                Services
              </a>
              <a
                href="#"
                className="text-primary font-medium"
                data-testid="link-careers"
              >
                Careers
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-contact"
              >
                Contact
              </a>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              data-testid="button-menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1
              className="text-4xl md:text-6xl font-bold mb-6"
              data-testid="text-hero-title"
            >
              Join Our Healthcare Family
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 opacity-90"
              data-testid="text-hero-subtitle"
            >
              Building careers while caring for our community. We offer
              meaningful opportunities for qualified professionals to make a
              difference in healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="button-view-openings"
                >
                  <a href="#opportunities">View Openings</a>
                </Button>

                <Button
                  asChild
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="button-contact-hr"
                >
                  <a href="#contact">Contact HR</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
              data-testid="text-welcome-title"
            >
              Welcome to Your Healthcare Career
            </h2>
            <p
              className="text-lg text-muted-foreground mb-8"
              data-testid="text-welcome-description"
            >
              At Vardaan Hospital, we believe in empowering our team members to
              grow professionally while serving our community. We are committed
              to providing meaningful employment opportunities for qualified
              individuals who share our passion for compassionate healthcare.
              Join us in our mission to deliver world-class medical care with a
              human touch.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-[#5BD637] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-2xl text-primary-foreground w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Compassionate Care
                </h3>
                <p className="text-muted-foreground">
                  Join a team dedicated to patient-centered healthcare
                  excellence
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#5BD637] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="text-2xl text-primary-foreground w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Professional Growth
                </h3>
                <p className="text-muted-foreground">
                  Continuous learning opportunities and career advancement
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#5BD637] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-2xl text-primary-foreground w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
                <p className="text-muted-foreground">
                  Make a meaningful difference in people's lives every day
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Opportunities */}
      <section id="opportunities" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              data-testid="text-opportunities-title"
            >
              Current Job Opportunities
            </h2>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-opportunities-description"
            >
              Explore our available positions across various departments and
              find the perfect opportunity to advance your healthcare career.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobPositions.map((position) => (
              <JobCard
                key={position.id}
                position={position}
                onApply={handleApply}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
              data-testid="text-benefits-title"
            >
              Why Choose Vardaan Hospital?
            </h2>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-benefits-description"
            >
              Join a team that values excellence, compassion, and professional
              development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#5BD637] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-3xl text-primary-foreground w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Award-Winning Care
              </h3>
              <p className="text-muted-foreground text-sm">
                Best Healthcare Innovation 2024 recipient
                
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#5BD637] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className=" text-3xl text-primary-foreground w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Competitive Benefits
              </h3>
              <p className="text-muted-foreground text-sm">
                Comprehensive salary and benefits package
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#5BD637] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="text-3xl text-primary-foreground w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Advanced Technology
              </h3>
              <p className="text-muted-foreground text-sm">
                Work with cutting-edge medical equipment
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#5BD637] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="text-3xl text-primary-foreground w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Work-Life Balance
              </h3>
              <p className="text-muted-foreground text-sm">
                Flexible schedules and supportive environment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                data-testid="text-process-title"
              >
                How to Apply
              </h2>
              <p
                className="text-lg text-muted-foreground"
                data-testid="text-process-description"
              >
                Ready to join our healthcare family? Follow these simple steps
                to submit your application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-[#5BD637] text-accent-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Choose Position
                </h3>
                <p className="text-muted-foreground text-sm">
                  Review available positions and select the role that matches
                  your qualifications and interests.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#5BD637] text-accent-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Submit Application
                </h3>
                <p className="text-muted-foreground text-sm">
                  Complete the application form with your resume, cover letter,
                  and required documents.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#5BD637] text-accent-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Interview Process
                </h3>
                <p className="text-muted-foreground text-sm">
                  Our HR team will review your application and schedule an
                  interview if you meet our criteria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section
        id="contact"
        className="py-16 gradient-bg text-primary-foreground"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              data-testid="text-contact-title"
            >
              Get in Touch
            </h2>
            <p
              className="text-xl mb-8 opacity-90"
              data-testid="text-contact-description"
            >
              Have questions about our career opportunities? Our HR team is here
              to help.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="bg-primary-foreground/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-2xl w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-lg">HR Department</p>
                <a
                  href="tel:+919450031383"
                  className="text-lg hover:underline"
                  data-testid="link-phone"
                >
                  +91 94500 31383
                </a>
              </div>
              <div className="text-center">
                <div className="bg-primary-foreground/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-2xl w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-lg">careers@vardaanhealth.com</p>
                <p className="text-lg">hr@vardaanhealth.com</p>
              </div>
            </div>

            <div className="text-center">
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-send-resume"
              >
                <a href="mailto:careers@vardaanhealth.com">Send Your Resume</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="bg-[#061D18] text-white py-12">
        <div className="container mx-auto px-4 text-center space-y-6">
          {/* Logo */}
          <div>
            <img
              src="https://www.vardaanhealth.com/Vardaan%20Logo.webp"
              alt="Vardaan Hospital Logo"
              className="h-16 w-auto mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold">Vardaan Hospital</h2>
            <p className="text-lg font-medium" style={{ color: "#5EEAD4" }}>
              वरदान! जहाँ देखभाल है सबसे खास
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#5EEAD4]" />
              +91 94500 31383
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#5EEAD4]" />
              doctor@vardaanhealth.com
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#5EEAD4]" />
              Station Road, Mulla Talab, Bhadohi
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-6 font-medium">
            <a href="#" className="hover:text-[#5EEAD4]">
              Home
            </a>
            <a href="#" className="hover:text-[#5EEAD4]">
              About
            </a>
            <a href="#" className="hover:text-[#5EEAD4]">
              Departments
            </a>
            <a href="#" className="hover:text-[#5EEAD4]">
              Doctors
            </a>
            <a href="#" className="hover:text-[#5EEAD4]">
              Testimonials
            </a>
            <a href="#" className="hover:text-[#5EEAD4]">
              Contact
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 text-2xl">
            <a
              href="#"
              className="p-3 rounded-full border border-white hover:bg-[#5EEAD4] hover:text-[#061D18] transition"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="p-3 rounded-full border border-white hover:bg-[#5EEAD4] hover:text-[#061D18] transition"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="p-3 rounded-full border border-white hover:bg-[#5EEAD4] hover:text-[#061D18] transition"
            >
              <YoutubeIcon className="w-6 h-6" />
            </a>
          </div>

          {/* Bottom Note */}
          <div className="text-sm text-gray-400">
            <p>© 2025 Vardaan Hospital. All rights reserved.</p>
            <p>
              Developed by{" "}
              <a
                href="https://skilllogic.in"
                className="text-[#5EEAD4] hover:underline"
              >
                Skilllogic Technologies
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Application Dialog */}
      <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
        <ApplicationForm
          position={selectedPosition}
          onClose={handleCloseApplication}
        />
      </Dialog>
    </div>
  );
}
