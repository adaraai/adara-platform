import { Button } from "@/components/ui/button"
import { Menu, X, User, Bell, Search, Settings, LogOut } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function LabelerHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="w-full px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/labeler-dashboard" className="flex items-center space-x-2 flex-shrink-0">
          <img 
            src="https://res.cloudinary.com/ecosheane/image/upload/v1754217265/lable_z2geih.png" 
            alt="Labilo Logo" 
            className="h-6 sm:h-8 w-auto"
          />
        </Link>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-10 w-64 border-0 bg-muted/50 focus:bg-background" 
            />
          </div>
          <Button variant="ghost" size="sm" className="text-sm relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">2</Badge>
          </Button>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm"
              onMouseEnter={() => setIsProfileDropdownOpen(true)}
              onMouseLeave={() => setIsProfileDropdownOpen(false)}
            >
              <User className="h-4 w-4" />
            </Button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                <button className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-left">
                  <User className="h-4 w-4 mr-2 inline" />
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-left">
                  <Settings className="h-4 w-4 mr-2 inline" />
                  Settings
                </button>
                <button className="w-full px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left">
                  <LogOut className="h-4 w-4 mr-2 inline" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 h-9 w-9 flex items-center justify-center"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-lg border-b border-border">
          <nav className="w-full px-3 sm:px-6 lg:px-8 py-6 space-y-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tasks..." 
                className="pl-10 w-full" 
              />
            </div>
            
            <div className="pt-6 space-y-3 border-t border-border mt-4">
              <Button variant="ghost" size="sm" className="w-full justify-start text-base">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-base">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
} 