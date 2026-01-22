"use client"

import { cn } from "@/lib/utils"
import { AnimatedList } from "./animated-list"
import { Code2, Layers, LucideIcon, Shield, Zap } from "lucide-react"

interface Item {
  name: string
  description: string
  icon: LucideIcon
  color: string
  time?: string
}


    // <div className="p-8 lg:p-10">
    //         <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-6">
    //           <Zap className="h-6 w-6 text-success" />
    //         </div>
    //         <h3 className="text-lg font-semibold text-foreground mb-3">Lightning Fast</h3>
    //         <p className="text-muted-foreground text-sm leading-relaxed">
    //           Send requests and get responses in milliseconds. Built for speed with optimized performance.
    //         </p>
    //       </div>

    //       <div className="p-8 lg:p-10">
    //         <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center mb-6">
    //           <Code2 className="h-6 w-6 text-info" />
    //         </div>
    //         <h3 className="text-lg font-semibold text-foreground mb-3">Developer First</h3>
    //         <p className="text-muted-foreground text-sm leading-relaxed">
    //           Syntax highlighting, smart autocomplete, and keyboard shortcuts for power users.
    //         </p>
    //       </div>

    //       <div className="p-8 lg:p-10">
    //         <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mb-6">
    //           <Layers className="h-6 w-6 text-warning" />
    //         </div>
    //         <h3 className="text-lg font-semibold text-foreground mb-3">Collections</h3>
    //         <p className="text-muted-foreground text-sm leading-relaxed">
    //           Organize your requests into collections. Save, share, and reuse your API workflows.
    //         </p>
    //       </div>

    //       <div className="p-8 lg:p-10">
    //         <div className="h-12 w-12 rounded-lg bg-error/10 flex items-center justify-center mb-6">
    //           <Shield className="h-6 w-6 text-error" />
    //         </div>
    //         <h3 className="text-lg font-semibold text-foreground mb-3">Secure</h3>
    //         <p className="text-muted-foreground text-sm leading-relaxed">
    //           Your data is encrypted. We never store your API keys or sensitive information.
    //         </p>
    //       </div>
    

    let notifications: Item[] = [
        {
          name: "Lightning Fast",
          description: "Saves time with speedy responses",
        //   time: "15m ago",
          icon: Zap,
          color: "#00C9A7",
        },
        {
          name: "Secure",
          description: "Magic UI",
        //   time: "10m ago",
          icon: Shield,
          color: "#FFB800",
        },
        {
          name: "Collections",
          description: "Magic UI",
        //   time: "5m ago",
          icon: Layers,
          color: "#FF3D71",
        },
        {
          name: "Developer First",
          description: "Magic UI",
        //   time: "2m ago",
          icon: Code2,
          color: "#1E86FF",
        },
      ]
      

notifications = Array.from({ length: 10 }, () => notifications).flat()

const Notification = ({ name, description, icon: Icon, color, time }: Item) => {
    return (
      <figure className={cn(
        "relative mx-auto min-h-fit w-full max-w-135 cursor-pointer overflow-hidden rounded-2xl p-6",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}>
        <div className="flex flex-row items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-2xl"
            style={{ backgroundColor: color }}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
  
          <div className="flex flex-col overflow-hidden">
            <figcaption className="flex items-center text-md font-medium">
              {name}
              <span className="mx-1 text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{time}</span>
            </figcaption>
  
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </figure>
    )
  }
  

export function AnimatedListDemo({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
    </div>
  )
}
