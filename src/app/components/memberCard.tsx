import Image from "next/image";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";

export interface Member {
  firstName: string;
  lastName: string;
  photo?: string;
  github?: string;
  linkedin?: string;
}

interface MemberCardProps {
  member: Member;
  isLeader: boolean;
}

export default function MemberCard({ member, isLeader }: MemberCardProps) {
  return (
    <div
      className={`flex flex-col items-center p-6 rounded-xl transition-all duration-300 
        ${isLeader
          ? "border-4 border-accent/80 shadow-lg shadow-accent/20 dark:border-[##fa802f] dark:shadow-[#fa802f]/30"
          : "border border-accent/20 dark:border-[#30363d]"
        } 
       
        bg-gradient-to-br from-foreground/20 to-foreground/30 dark:from-accent/10 dark:to-background/20
        dark:bg-[#0d1117]
        backdrop-blur-lg
        hover:shadow-xl
        relative
        overflow-hidden
        group
        hover:animate-shine-once
        `}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none 
             bg-gradient-to-br 
             from-transparent 
             via-black/25 
             to-transparent 
             opacity-0 
             group-hover:opacity-100 
             transition-opacity duration-300 
             dark:via-[#fa802f]/20"
      />
      {/* Member photo */}
      <div className="p-1 rounded-full bg-gradient-to-br from-accent/10 to-background/20 dark:from-[#161b22] dark:to-[#0d1117] backdrop-blur-md">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={`${member.firstName} ${member.lastName}`}
            width={112}
            height={112}
            className="rounded-full transition-transform duration-300 hover:scale-110 w-24 h-24 object-cover border-2 border-accent/20 dark:border-[#30363d]"
          />
        ) : (
          <div className="w-24 h-24 rounded-full flex items-center justify-center bg-background/40 dark:bg-[#161b22] backdrop-blur-sm border border-accent/10 dark:border-[#30363d]">
            <span className="text-[hsl(var(--foreground)/0.9)] dark:text-[hsl(var(--foreground))] text-2xl font-medium tracking-tighter">
              {member.firstName[0]}
              {member.lastName[0]}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-xl font-semibold mt-4 bg-gradient-to-r from-[#FA802F] to-[#322505] dark:from-[#FA802F] dark:to-[#f3e8ca] bg-clip-text text-transparent">
        {member.firstName} {member.lastName}
      </h3>

      {/* Icons */}
      <div className="flex gap-4 mt-3">
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-background/20 hover:bg-accent/20 dark:bg-[#161b22] dark:hover:bg-[#fa802f]/30 transition-colors shadow-sm"
          >
            <AiFillGithub
              className="text-[#181717] dark:text-[#c9d1d9] hover:text-black dark:hover:text-white transition-colors duration-300 text-2xl"
              size={28}
            />
          </a>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-background/20 hover:bg-blue-400/20 dark:bg-[#161b22] dark:hover:bg-[#0d1117] transition-colors shadow-sm"
          >
            <AiFillLinkedin
              className="text-[#0077B5] hover:text-[#005582] transition-colors duration-300 text-2xl"
              size={28}
            />
          </a>
        )}
      </div>
    </div>
  );
}