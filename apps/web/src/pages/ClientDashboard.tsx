import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientHeader } from "@/components/client/ClientHeader"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  FileText, 
  BarChart3,
  Settings,
  Shield,
  Globe,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Activity,
  Database,
  UserCheck,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  Calendar,
  Zap,
  Menu,
  Bell,
  Sun,
  Moon,
  Home,
  Target,
  BarChart,
  Wallet,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
  Upload,
  FolderOpen,
  PieChart,
  CreditCard,
  MessageSquare,
  Brain,
  Workflow,
  Code,
  Link,
  Lock
} from "lucide-react"

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Mock data
  const clientStats = {
    totalProjects: 12,
    activeProjects: 5,
    totalSpent: 45600,
    avgAccuracy: 98.9,
    completionRate: 96.5,
    labelersWorking: 89
  }

  const recentProjects = [
    {
      id: "proj_001",
      name: "Wildlife Conservation Dataset",
      type: "Image Classification",
      status: "active",
      progress: 87,
      labelers: 45,
      accuracy: 98.9,
      budget: 25000,
      spent: 18500,
      deadline: "2024-01-15"
    },
    {
      id: "proj_002", 
      name: "Agricultural Crop Disease Detection",
      type: "Object Detection",
      status: "review",
      progress: 100,
      labelers: 23,
      accuracy: 99.4,
      budget: 18500,
      spent: 18500,
      deadline: "2024-01-10"
    },
    {
      id: "proj_003",
      name: "Swahili Language Model Training",
      type: "Text Annotation",
      status: "active",
      progress: 34,
      labelers: 67,
      accuracy: 97.8,
      budget: 45000,
      spent: 15300,
      deadline: "2024-02-28"
    }
  ]

  const topLabelers = [
    { name: "Amara Okonkwo", country: "Nigeria", tasks: 2847, accuracy: 99.2, completed: 2450 },
    { name: "Kofi Asante", country: "Ghana", tasks: 2634, accuracy: 98.9, completed: 2180 },
    { name: "Zara Mwangi", country: "Kenya", tasks: 2489, accuracy: 99.1, completed: 2100 },
    { name: "Fatima Al-Rashid", country: "Egypt", tasks: 2156, accuracy: 98.7, completed: 1850 }
  ]

  const menuItems = [
    { name: "Overview", icon: Home, value: "overview" },
    { name: "Projects", icon: FileText, value: "projects" },
    { name: "Analytics", icon: BarChart, value: "analytics" },
    { name: "Quality Control", icon: Shield, value: "quality" },
    { name: "AI Models", icon: Brain, value: "ai-models" },
    { name: "Data Pipeline", icon: Database, value: "data-pipeline" },
    { name: "Workflows", icon: Workflow, value: "workflows" },
    { name: "API Access", icon: Code, value: "api-access" },
    { name: "Security", icon: Lock, value: "security" },
    { name: "Reports & Support", icon: FileText, value: "reports-support" },
    { name: "Settings", icon: Settings, value: "settings" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-50"
      case "review": return "text-blue-600 bg-blue-50"
      case "completed": return "text-gray-600 bg-gray-50"
      case "paused": return "text-orange-600 bg-orange-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ClientHeader />

      <div className="flex pt-16">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Modern Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed inset-y-0 left-0 z-50 w-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transform transition-all duration-200 ease-in-out group hover:w-48 overflow-hidden shadow-lg`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                              <div className="flex justify-center group-hover:justify-start group-hover:pl-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <img 
                    src="https://res.cloudinary.com/ecosheane/image/upload/v1754217265/lable_z2geih.png" 
                    alt="Labilo Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-6 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.value)}
                  className={`w-full flex items-center justify-center group-hover:justify-start group-hover:pl-3 group-hover:pr-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === item.value
                      ? darkMode 
                        ? 'bg-blue-900 text-blue-300 border border-blue-700'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-3 min-w-0">{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 ml-16 lg:ml-16">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="mb-6">
                <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Client Dashboard</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Monitor your data annotation projects and results.</p>
              </div>

              {/* Recent Projects */}
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Recent Projects</CardTitle>
                      <CardDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your latest data annotation projects</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">View All</Button>
                  </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className={`flex items-center justify-between p-4 rounded-lg border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                            <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{project.name}</h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{project.labelers} labelers</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{project.accuracy}% accuracy</p>
                      </div>
                      <div className="text-right">
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>${project.spent.toLocaleString()}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>of ${project.budget.toLocaleString()}</p>
                          </div>
                          <div className="w-20">
                            <Progress value={project.progress} className="h-2" />
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{project.progress}%</p>
                      </div>
                      <Badge className={`${getStatusColor(project.status)} border-0`}>
                            {project.status}
                      </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                    </div>
                  </div>
                ))}
              </div>
                </CardContent>
                </Card>

              {/* Top Labelers Working */}
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <CardHeader>
                  <CardTitle className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Top Labelers Working</CardTitle>
                  <CardDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Best performing labelers on your projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                    {topLabelers.map((labeler, index) => (
                      <div key={labeler.name} className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {index + 1}
                            </div>
                            {index < 3 && <Star className="h-4 w-4 text-yellow-500" />}
                            </div>
                            <div>
                            <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{labeler.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{labeler.country}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                            <div className="text-right">
                            <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{labeler.completed.toLocaleString()}</p>
                            <p className="text-muted-foreground">Completed</p>
                            </div>
                            <div className="text-right">
                            <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{labeler.accuracy}%</p>
                            <p className="text-muted-foreground">Accuracy</p>
                            </div>
                          <div className="text-right">
                            <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{labeler.tasks.toLocaleString()}</p>
                            <p className="text-muted-foreground">Total Tasks</p>
                          </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          {/* Coming Soon Pages */}
          {activeTab === "projects" && (
              <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Projects</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Manage all your data annotation projects.</p>
                      </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Project management features are under development.</p>
                </CardContent>
              </Card>
                      </div>
          )}

          {activeTab === "upload" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Upload Data</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Upload your data for annotation.</p>
                    </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Data upload features are under development.</p>
                  </CardContent>
                </Card>
                      </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Analytics</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Detailed project analytics and insights.</p>
                            </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <BarChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Analytics dashboard is under development.</p>
                </CardContent>
              </Card>
                            </div>
          )}

          {activeTab === "quality" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Quality Control</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Review and manage annotation quality.</p>
                          </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Quality control features are under development.</p>
                </CardContent>
              </Card>
                        </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Billing</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Manage your billing and payments.</p>
                      </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Billing features are under development.</p>
                  </CardContent>
                </Card>
                      </div>
          )}

          {activeTab === "reports-support" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Reports & Support</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Generate reports and get support for your projects.</p>
                    </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Reporting and support features are under development.</p>
                  </CardContent>
                </Card>
              </div>
            )}

                     {activeTab === "ai-models" && (
              <div className="space-y-6">
               <div className="mb-6">
                 <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>AI Models</h1>
                 <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Access and manage AI models for your projects.</p>
                        </div>
               <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                 <CardContent className="p-12 text-center">
                   <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                   <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                   <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>AI model access features are under development.</p>
                 </CardContent>
               </Card>
                        </div>
           )}

           {activeTab === "data-pipeline" && (
             <div className="space-y-6">
               <div className="mb-6">
                 <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Data Pipeline</h1>
                 <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Configure data processing and ingestion workflows.</p>
                      </div>
               <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                 <CardContent className="p-12 text-center">
                   <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                   <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                   <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Data pipeline features are under development.</p>
                 </CardContent>
               </Card>
                      </div>
           )}

           {activeTab === "workflows" && (
             <div className="space-y-6">
               <div className="mb-6">
                 <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Workflows</h1>
                 <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Design and manage annotation workflows.</p>
                    </div>
               <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                 <CardContent className="p-12 text-center">
                   <Workflow className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                   <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                   <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Workflow management features are under development.</p>
                  </CardContent>
                </Card>
                      </div>
           )}

           {activeTab === "api-access" && (
             <div className="space-y-6">
               <div className="mb-6">
                 <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>API Access</h1>
                 <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Manage API keys and access endpoints.</p>
                    </div>
               <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                 <CardContent className="p-12 text-center">
                   <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                   <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                   <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>API access features are under development.</p>
                 </CardContent>
               </Card>
                      </div>
           )}

           {activeTab === "integrations" && (
             <div className="space-y-6">
               <div className="mb-6">
                 <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Integrations</h1>
                 <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Connect with your existing tools and services.</p>
                    </div>
               <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                 <CardContent className="p-12 text-center">
                   <Link className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                   <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                   <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Integration features are under development.</p>
                 </CardContent>
               </Card>
                      </div>
           )}

           {activeTab === "security" && (
             <div className="space-y-6">
               <div className="mb-6">
                 <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Security</h1>
                 <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Manage security settings and access controls.</p>
                    </div>
               <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                 <CardContent className="p-12 text-center">
                   <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                   <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                   <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Security features are under development.</p>
                  </CardContent>
                </Card>
             </div>
           )}

           {activeTab === "settings" && (
             <div className="space-y-6">
               <div className="mb-6">
                 <h1 className={`text-2xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Settings</h1>
                 <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Configure your account and preferences.</p>
                  </div>
               <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                 <CardContent className="p-12 text-center">
                   <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                   <h2 className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                   <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Settings panel is under development.</p>
                </CardContent>
              </Card>
             </div>
            )}
        </main>
      </div>
    </div>
  )
}