"use client";
import React from "react";
import Link from "@/components/Link";
import Tag from "@/components/post/Tag";
import siteMetadata from "@/data/siteMetadata";
import { formatDate } from "pliny/utils/formatDate";
import Image from "next/image";
import { getColorForTag } from "@/components/post/Tag";

export type Post = {
  slug: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
  cover?: string;
  icon?: string;
};

const IconComponent = ({ iconName }: { iconName: string }) => {
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

        switch (prefix) {
          case "io":
            iconModule = await import("react-icons/io");
            iconComponent = iconModule[name];
            if (iconComponent) setIcon(() => iconComponent);
            break;
          case "io5":
            iconModule = await import("react-icons/io5");
            iconComponent = iconModule[name];
            if (iconComponent) setIcon(() => iconComponent);
            break;
          case "ri":
            iconModule = await import("react-icons/ri");
            iconComponent = iconModule[name];
            if (iconComponent) setIcon(() => iconComponent);
            break;
          case "fa":
            iconModule = await import("react-icons/fa");
            iconComponent = iconModule[name];
            if (iconComponent) setIcon(() => iconComponent);
            break;
          case "lia":
            iconModule = await import("react-icons/lia");
            iconComponent = iconModule[name];
            if (iconComponent) setIcon(() => iconComponent);
            break;
          case "md":
            iconModule = await import("react-icons/md");
            iconComponent = iconModule[name];
            if (iconComponent) setIcon(() => iconComponent);
            break;
          case "tb":
            iconModule = await import("react-icons/tb");
            iconComponent = iconModule[name];
            if (iconComponent) setIcon(() => iconComponent);
            break;
          case "gi":
            iconModule = await import("react-icons/gi");
            iconComponent = iconModule[name];
            if (iconComponent) setIcon(() => iconComponent);
            break;
          default:
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
    <Icon className="w-32 h-32 text-black/70 dark:text-white/90 transition-transform duration-300 group-hover:scale-105" />
  );
};

export default function PostCard({ post }: { post: Post }) {
  const { slug, date, title, summary, tags, cover, icon } = post;

  return (
    <article
      className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-xl 
      transition-all duration-300 
      backdrop-blur-md bg-white/80 dark:bg-gray-700/20 
      border border-white/20 dark:border-gray-700/20
      hover:bg-white/90 dark:hover:bg-gray-600/20"
    >
      <Link href={`/blog/${slug}`} className="block">
        <div className="overflow-hidden relative h-64 w-full">
          {cover ? (
            <Image
              src={cover}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : icon ? (
            <div
              className={`w-full h-full ${getColorForTag(icon)} relative flex items-center justify-center`}
            >
              <IconComponent iconName={icon} />
            </div>
          ) : (
            <Image
              src="/static/images/default-cover.jpg"
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-gray-800/90 from-0% via-transparent via-60%"></div>
        </div>

        <div className="relative p-6 -mt-16 z-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>

          <h2 className="text-xl font-bold pt-4 mb-3 text-gray-900 dark:text-gray-100 line-clamp-2">
            {title}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {summary}
          </p>

          <div className="flex justify-between items-center text-sm">
            <time className="text-primary-500 dark:text-primary-400">
              {formatDate(date, siteMetadata.locale)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}
