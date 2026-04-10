'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck, faCartShopping } from '@fortawesome/free-solid-svg-icons'

export type TasksTab = 'tasks' | 'shopping'

const TABS: { key: TasksTab; label: string; icon: typeof faListCheck }[] = [
  { key: 'tasks', label: 'משימות', icon: faListCheck },
  { key: 'shopping', label: 'קניות', icon: faCartShopping },
]

interface TasksTabBarProps {
  activeTab: TasksTab
  onTabChange: (tab: TasksTab) => void
}

const TasksTabBar = ({ activeTab, onTabChange }: TasksTabBarProps) => (
  <div className="mb-4 flex shrink-0 border-b border-gray-200" dir="rtl">
    {TABS.map((tab) => (
      <button
        key={tab.key}
        type="button"
        onClick={() => onTabChange(tab.key)}
        className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors cursor-pointer
          ${activeTab === tab.key
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
          }`}>
        <FontAwesomeIcon icon={tab.icon} className="h-4 w-4" />
        {tab.label}
      </button>
    ))}
  </div>
)

export default TasksTabBar
