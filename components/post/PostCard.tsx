'use client';
import React from 'react'
import Link from '@/components/Link'
import Tag from '@/components/post/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import Image from 'next/image'
import { getColorForTag } from '@/components/post/Tag'

export type Post = {
  slug: string
  date: string
  title: string
  summary: string
  tags: string[]
  cover?: string
  icon?: string
}

const IconComponent = ({ iconName }: { iconName: string }) => {
  const [Icon, setIcon] = React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    const loadIcon = async () => {
      if (!iconName) return;
      
      const [prefix, name] = iconName.split(':');
      
      try {
        switch (prefix) {
          case 'io':
            const IoModule = await import('react-icons/io');
            const IoIcon = IoModule[name];
            if (IoIcon) setIcon(() => IoIcon);
            break;
          case 'io5':
            const Io5Module = await import('react-icons/io5');
            const Io5Icon = Io5Module[name];
            if (Io5Icon) setIcon(() => Io5Icon);
            break;
          case 'ri':
            const RiModule = await import('react-icons/ri');
            const RiIcon = RiModule[name];
            if (RiIcon) setIcon(() => RiIcon);
            break;
          case 'fa':
            const FaModule = await import('react-icons/fa');
            const FaIcon = FaModule[name];
            if (FaIcon) setIcon(() => FaIcon);
            break;
          case 'lia':
            const LiaModule = await import('react-icons/lia');
            const LiaIcon = LiaModule[name];
            if (LiaIcon) setIcon(() => LiaIcon);
            break;
          case 'md':
            const MdModule = await import('react-icons/md');
            const MdIcon = MdModule[name];
            if (MdIcon) setIcon(() => MdIcon);
            break;
          case 'tb':
            const TbModule = await import('react-icons/tb');
            const TbIcon = TbModule[name];
            if (TbIcon) setIcon(() => TbIcon);
            break;
          case 'gi':
            const GiModule = await import('react-icons/gi');
            const GiIcon = GiModule[name];
            if (GiIcon) setIcon(() => GiIcon);
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
    <Icon className="w-32 h-32 text-black/90 dark:text-white/90 transition-transform duration-300 group-hover:scale-105" />
  );
};

export default function PostCard({ post }: { post: Post }) {
  const { slug, date, title, summary, tags, cover, icon } = post

  return (
    <article className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-xl 
      transition-all duration-300 
      backdrop-blur-md bg-white/80 dark:bg-gray-700/20 
      border border-white/20 dark:border-gray-700/20
      hover:bg-white/90 dark:hover:bg-gray-600/20">
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
            <div className={`w-full h-full ${getColorForTag(icon)} relative flex items-center justify-center`}>
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
  )
} 