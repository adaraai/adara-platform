import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LabelerHeader } from "@/components/labelers/LabelerHeader"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Star, 
  Clock, 
  CheckCircle, 
  DollarSign,
  FileText,
  Image,
  Mic,
  Video,
  MessageSquare,
  Trophy,
  Target,
  TrendingUp,
  Award,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  Search,
  Filter,
  User,
  Zap,
  Shield,
  Activity,
  Calendar,
  Play,
  Menu,
  Bell,
  Mail,
  Settings as SettingsIcon,
  LogOut,
  Home,
  Database,
  BarChart,
  Wallet,
  Users,
  BookOpen,
  Award as AwardIcon,
  Target as TargetIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon2,
  HelpCircle as HelpCircleIcon,
  LogOut as LogOutIcon,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon
} from "lucide-react"

export default function LabelerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  
  // Mock data for available tasks
  const availableTasks = [
    {
      id: "task_001",
      title: "Wildlife Image Classification",
      description: "Classify animals in African wildlife photos",
      type: "image",
      payment: 0.25,
      difficulty: "Easy",
      remaining: 150,
      timeEstimate: "2-3 min"
    },
    {
      id: "task_002", 
      title: "Swahili Audio Transcription",
      description: "Transcribe Swahili conversations",
      type: "audio",
      payment: 0.50,
      difficulty: "Medium",
      remaining: 75,
      timeEstimate: "5-8 min"
    },
    {
      id: "task_003",
      title: "Agricultural Text Classification",
      description: "Categorize farming-related text data",
      type: "text",
      payment: 0.15,
      difficulty: "Easy",
      remaining: 200,
      timeEstimate: "1-2 min"
    },
    {
      id: "task_004",
      title: "Video Content Moderation",
      description: "Review and moderate video content",
      type: "video",
      payment: 0.75,
      difficulty: "Hard",
      remaining: 25,
      timeEstimate: "10-15 min"
    }
  ]

  // Mock data for recent earnings
  const recentEarnings = [
    { date: "Today", amount: 12.50, tasks: 25 },
    { date: "Yesterday", amount: 18.75, tasks: 38 },
    { date: "Dec 1", amount: 22.25, tasks: 45 },
    { date: "Nov 30", amount: 15.00, tasks: 30 },
  ]

  const menuItems = [
    { name: "Dashboard", icon: Home, value: "overview" },
    { name: "Projects", icon: Database, value: "projects" },
    { name: "Tasks", icon: TargetIcon, value: "tasks" },
    { name: "Analytics", icon: BarChart, value: "analytics" },
    { name: "Earnings", icon: Wallet, value: "earnings" },
    { name: "Training", icon: BookOpen, value: "training" },
    { name: "Community", icon: Users, value: "community" },
    { name: "Quality Score", icon: AwardIcon, value: "quality" },
    { name: "Performance", icon: TrendingUpIcon, value: "performance" },
    { name: "Settings", icon: SettingsIcon2, value: "settings" },
    { name: "Help", icon: HelpCircleIcon, value: "help" },
  ]

  const quickStats = [
    {
      label: "Tasks Completed",
      value: "2,847",
      change: "+18% from last month",
      color: "text-green-600",
      icon: CheckCircle
    },
    {
      label: "Current Rank",
      value: "#47",
      change: "Top 5% of labelers",
      color: "text-blue-600",
      icon: Trophy
    },
    {
      label: "Available Tasks",
      value: "47",
      change: "Premium tasks available",
      color: "text-purple-600",
      icon: Activity
    }
  ]

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "image": return <Image className="h-4 w-4" />
      case "audio": return <Mic className="h-4 w-4" />
      case "video": return <Video className="h-4 w-4" />
      case "text": return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-600 bg-green-50"
      case "Medium": return "text-yellow-600 bg-yellow-50"
      case "Hard": return "text-red-600 bg-red-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <LabelerHeader />

      <div className="flex pt-16">
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
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Welcome back, John</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Here's your annotation overview for today.</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Completed</p>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>247</p>
                        <p className="text-xs text-green-600">+12% from yesterday</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quality Score</p>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>98.2%</p>
                        <p className="text-xs text-blue-600">Excellent</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Award className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Today's Earnings</p>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>$45.20</p>
                        <p className="text-xs text-green-600">+$8.50 from yesterday</p>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Available Tasks</p>
                        <p className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>23</p>
                        <p className="text-xs text-orange-600">High priority</p>
                      </div>
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Target className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Task Queue and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Task Queue */}
                <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <CardHeader>
                    <CardTitle className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Current Task Queue</CardTitle>
                    <CardDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your next annotation tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className={`flex items-center justify-between p-3 ${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-lg border`}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Image className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Image Classification</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Wildlife photos • 150 remaining</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>$0.25</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>per task</p>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-3 ${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} rounded-lg border`}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Mic className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Audio Transcription</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Swahili conversations • 75 remaining</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>$0.50</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>per task</p>
                        </div>
                      </div>

                      <div className={`flex items-center justify-between p-3 ${darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200'} rounded-lg border`}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Text Classification</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Agricultural data • 200 remaining</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>$0.15</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>per task</p>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                      Start Next Task
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                  <CardHeader>
                    <CardTitle className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Recent Activity</CardTitle>
                    <CardDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your latest annotation work</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Completed 25 image classifications</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>2 minutes ago • Quality: 98%</p>
                        </div>
                        <span className="text-sm font-medium text-green-600">+$6.25</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Completed 12 audio transcriptions</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>15 minutes ago • Quality: 97%</p>
                        </div>
                        <span className="text-sm font-medium text-blue-600">+$6.00</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Completed 30 text classifications</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>1 hour ago • Quality: 99%</p>
                        </div>
                        <span className="text-sm font-medium text-purple-600">+$4.50</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Quality review completed</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>2 hours ago • Score: 98.2%</p>
                        </div>
                        <span className="text-sm font-medium text-orange-600">Excellent</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quality Performance */}
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardHeader>
                  <CardTitle className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Quality Performance</CardTitle>
                  <CardDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your annotation accuracy and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Overall Accuracy</h3>
                        <span className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>98.2%</span>
                      </div>
                      <div className="relative h-20 mb-2">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              className={darkMode ? "text-gray-700" : "text-gray-200"}
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              className="text-green-500"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.982)}`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last 30 days</p>
                    </div>
                    
                    <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Image Classification</h3>
                        <span className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>99.1%</span>
                      </div>
                      <div className="relative h-20 mb-2">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              className={darkMode ? "text-gray-700" : "text-gray-200"}
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              className="text-blue-500"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.991)}`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy rate</p>
                    </div>
                    
                    <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Audio Transcription</h3>
                        <span className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>97.8%</span>
                      </div>
                      <div className="relative h-20 mb-2">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              className={darkMode ? "text-gray-700" : "text-gray-200"}
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              className="text-purple-500"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.978)}`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy rate</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Task Completion Trend</h3>
                        <span className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>2.3 min</span>
                      </div>
                      <div className="h-20 flex items-end space-x-1">
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '60%'}}></div>
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '75%'}}></div>
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '85%'}}></div>
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '70%'}}></div>
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '90%'}}></div>
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '95%'}}></div>
                        <div className="flex-1 bg-green-500 rounded-t" style={{height: '100%'}}></div>
                      </div>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last 7 days</p>
                    </div>
                    
                    <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Quality Score Trend</h3>
                        <span className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>96.5%</span>
                      </div>
                      <div className="h-20 flex items-end space-x-1">
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '92%'}}></div>
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '94%'}}></div>
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '93%'}}></div>
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '95%'}}></div>
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '97%'}}></div>
                        <div className={`flex-1 rounded-t ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{height: '96%'}}></div>
                        <div className="flex-1 bg-blue-500 rounded-t" style={{height: '96.5%'}}></div>
                      </div>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last 7 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Coming Soon Pages with Dark Mode */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Projects</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Manage your annotation projects and assignments.</p>
              </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Project management features are under development.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Tasks</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>View and manage your annotation tasks.</p>
              </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <TargetIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Task management features are under development.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Analytics</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Detailed performance analytics and insights.</p>
              </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <BarChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Analytics dashboard is under development.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "earnings" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Earnings</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Track your earnings and payment history.</p>
              </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Earnings tracking features are under development.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "training" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Training</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Access training materials and improve your skills.</p>
              </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Training platform is under development.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "community" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Community</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Connect with other labelers and share experiences.</p>
              </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Community features are under development.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "quality" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Quality Score</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Monitor your quality metrics and performance.</p>
              </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <AwardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Quality score dashboard is under development.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Performance</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Track your performance metrics and improvements.</p>
              </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <TrendingUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Performance tracking features are under development.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Settings</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Configure your account and preferences.</p>
              </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <SettingsIcon2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Settings panel is under development.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "help" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Help & Support</h1>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Get help and access support resources.</p>
              </div>
              <Card className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
                <CardContent className="p-12 text-center">
                  <HelpCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Coming Soon</h2>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Help and support features are under development.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}