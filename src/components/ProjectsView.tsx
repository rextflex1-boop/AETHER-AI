import React, { useState } from 'react';
import { ArrowLeft, SlidersHorizontal, Search, FolderKanban, Plus } from 'lucide-react';

interface ProjectsViewProps {
  onBack: () => void;
  onNewChat: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onBack, onNewChat }) => {
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<string[]>([]);

  const handleCreateProject = () => {
    const name = window.prompt('Enter project name:');
    if (name && name.trim()) {
      setProjects((prev) => [...prev, name.trim()]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-[#fcfbf9] overflow-hidden select-none">
      {/* Top Header matching Screenshot 4 */}
      <header className="shrink-0 h-14 border-b border-[#ece7dc] px-4 flex items-center justify-between bg-[#fcfbf9]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-xl text-[#3d382f] hover:bg-[#efe9dd] transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-lg font-serif font-semibold text-[#1e1c18]">
            Projects
          </h1>
        </div>
        <button
          type="button"
          className="p-2 rounded-xl text-[#4a4437] hover:bg-[#efe9dd] transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4.5 h-4.5 stroke-[1.8]" />
        </button>
      </header>

      {/* Search Input matching Screenshot 4 */}
      <div className="px-4 py-2.5 shrink-0">
        <div className="relative">
          <Search className="w-4.5 h-4.5 absolute left-3.5 top-3 text-[#999282]" />
          <input
            type="text"
            placeholder="Search projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white text-[#2d2922] placeholder:text-[#999282] rounded-xl border border-[#e5dfd2] focus:border-[#c5bca8] outline-none transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Projects Content matching Screenshot 4 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {projects.length === 0 ? (
          <>
            <div className="w-16 h-16 mb-4 text-[#8a8373] flex items-center justify-center">
              <FolderKanban className="w-14 h-14 stroke-[1.2]" />
            </div>
            <p className="text-sm md:text-[15px] text-[#4d473c] max-w-xs leading-relaxed font-normal">
              Create a project to organize chats with Ask AI around a topic or set of documents.
            </p>
          </>
        ) : (
          <div className="w-full max-w-md space-y-2 overflow-y-auto">
            {projects.map((p, i) => (
              <div
                key={i}
                className="p-3.5 bg-white rounded-2xl border border-[#ece7dc] text-left flex items-center gap-3 shadow-xs"
              >
                <FolderKanban className="w-5 h-5 text-[#8a8373]" />
                <span className="font-medium text-sm text-[#1e1c18]">{p}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom-Right "+ New project" Button matching Screenshot 4 */}
      <div className="p-4 flex justify-end shrink-0 z-20">
        <button
          type="button"
          onClick={handleCreateProject}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1e1b18] hover:bg-black active:scale-95 text-white text-sm font-medium shadow-xl transition-all cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5 stroke-[2]" />
          <span>New project</span>
        </button>
      </div>
    </div>
  );
};
