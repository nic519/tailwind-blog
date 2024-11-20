"use client";
import React from "react";

export const ShowIcon = ({ iconName, color }: { iconName: string, color: string }) => {
    const [Icon, setIcon] = React.useState<React.ComponentType<{
      className: string;
    }> | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
  
    React.useEffect(() => {
      setIsLoading(true);
      const loadIcon = async () => {
        if (!iconName) return;
  
        const [prefix, name] = iconName.split(":");
  
        try {
          let iconModule;
          let iconComponent;
          const iconPackages = {
            io: () => import("react-icons/io"),
            io5: () => import("react-icons/io5"),
            ri: () => import("react-icons/ri"),
            fa: () => import("react-icons/fa"),
            lia: () => import("react-icons/lia"),
            md: () => import("react-icons/md"),
            tb: () => import("react-icons/tb"),
            gi: () => import("react-icons/gi"),
          };
  
          const importFunction =
            iconPackages[prefix as keyof typeof iconPackages];
          if (importFunction) {
            try {
              iconModule = await importFunction();
              iconComponent = iconModule[name];
              if (iconComponent) setIcon(() => iconComponent);
            } catch (error) {
              console.error(`Failed to load icon: ${iconName}`, error);
              setIcon(null);
            }
          } else {
            setIcon(null);
          }
        } catch (error) {
          console.error(`Failed to load icon: ${iconName}`, error);
          setIcon(null);
        } finally {
          setIsLoading(false);
        }
      };
  
      loadIcon();
    }, [iconName]);
  
    if (isLoading) {
      return (
        <svg
          className={`w-32 h-32 ${color}`}
          viewBox="0 0 60 20"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <circle cx="8" cy="10" r="8">
            <animate
              attributeName="r"
              from="8"
              to="8"
              begin="0s"
              dur="0.8s"
              values="8;5;8"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="1"
              to="1"
              begin="0s"
              dur="0.8s"
              values="1;.5;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="30" cy="10" r="5" fillOpacity="0.3">
            <animate
              attributeName="r"
              from="5"
              to="5"
              begin="0s"
              dur="0.8s"
              values="5;8;5"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="0.5"
              to="0.5"
              begin="0s"
              dur="0.8s"
              values=".5;1;.5"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="52" cy="10" r="8">
            <animate
              attributeName="r"
              from="8"
              to="8"
              begin="0s"
              dur="0.8s"
              values="8;5;8"
              calcMode="linear"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill-opacity"
              from="1"
              to="1"
              begin="0s"
              dur="0.8s"
              values="1;.5;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      );
    }

    if (!Icon) return null;

    return (
      <Icon className={`w-32 h-32 ${color} transition-transform duration-300 group-hover:scale-105`} />
    );
  };