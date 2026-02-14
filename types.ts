
export type UserRole = 'admin' | 'listener';

export interface User {
  id: string;
  name: string;
  login: string;
  password: string;
  role: UserRole;
  courseStartDate: number;
  courseEndDate: number;
  stream: string;
  department: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface QuestionAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface TestAttempt {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timestamp: number;
  answers?: QuestionAnswer[];
  invalidated?: boolean;
  invalidReason?: string;
}

export interface LessonFile {
  name: string;
  size: number;
  type: string;
  data: string; // Base64 for files or URL for links
  isLink?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  coverImage?: string; // Base64 image string
  files: LessonFile[];
  questions: Question[];
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: number;
}

export interface TestResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timestamp: number;
  answers?: QuestionAnswer[];
  attempts?: number;
  invalidated?: boolean;
  invalidReason?: string;
  attemptsHistory?: TestAttempt[];
}

export interface Review {
  adminId: string;
  adminName: string;
  grade: number; // 1-5 scale
  comment?: string;
  timestamp: number;
}

export interface TaskResult {
  taskId: string;
  submitted: boolean;
  status: 'pending' | 'graded';
  reviews: Review[];
  response?: string;
  files?: LessonFile[];
  timestamp: number;
}

/** Элемент расписания занятий на неделю */
export interface ScheduleItem {
  id: string;
  dayOfWeek: number; // 1 = понедельник, 7 = воскресенье
  lessonId: string;
  durationHours: number;
  startTime: string; // "09:00"
  curators: string[]; // массив имён или id кураторов
}

/** Ответ API при загрузке всех данных (Google Apps Script) */
export interface ApiFetchResponse {
  users?: User[];
  lessons?: Lesson[];
  tasks?: Task[];
  schedule?: ScheduleItem[];
  results?: Array<{ userId: string; lessonId: string; [key: string]: unknown }>;
  submissions?: Array<{ userId: string; taskId: string; [key: string]: unknown }>;
  reviews?: Array<{ userId: string; taskId: string; adminId: string; grade: number; comment?: string; timestamp: number }>;
}

export type View = 'dashboard' | 'create-lesson' | 'edit-lesson' | 'view-lesson' | 'tasks' | 'create-task' | 'edit-task' | 'solve-task' | 'results' | 'review' | 'users' | 'login' | 'analytics' | 'validation' | 'schedule';
