"use client";
import React from "react";

export const ShowIcon = ({ iconName, color }: { iconName: string, color: string }) => {
    const [Icon, setIcon] = React.useState<React.ComponentType<{
      className: string;
    }> | null>(null);
  
    React.useEffect(() => {
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
        }
      };
  
      loadIcon();
    }, [iconName]);
  
    if (!Icon) return null;

    return (
      <Icon className={`w-32 h-32 ${color} transition-transform duration-300 group-hover:scale-105`} />
    );
  };