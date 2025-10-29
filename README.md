# 📅 Attendance Management App

A modern React-based attendance management system with calendar view and date-specific attendance tracking.

## ✨ Features

### 🗓️ Calendar View
- **Monthly Calendar Display**: Shows the current month with full calendar grid
- **Date Navigation**: Navigate between months using arrow buttons
- **Date Selection**: Click on any date to mark attendance for that day
- **Visual Indicators**: 
  - Today's date is highlighted in blue
  - Selected date is highlighted in primary color
  - Hover effects for better user experience

### 📝 Attendance Marking
- **Student List**: View all students for the selected date
- **Attendance Buttons**: Present, Absent, and Unmarked options
- **Real-time Statistics**: Live count of total, present, and absent students
- **Date-specific Data**: Each date maintains its own attendance records
- **Navigation**: Easy back-to-calendar navigation

### 🎨 Modern UI/UX
- **Material-UI Components**: Professional design system
- **Styled Components**: Custom styling with smooth animations
- **TypeScript**: Full type safety and better development experience
- **Responsive Design**: Works on all screen sizes
- **Gradient Backgrounds**: Beautiful visual design

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd attendance-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 How to Use

1. **Calendar View**: The app opens with a monthly calendar view
2. **Select Date**: Click on any date to mark attendance
3. **Mark Attendance**: Use Present/Absent/Unmarked buttons for each student
4. **View Statistics**: See real-time attendance counts
5. **Navigate Back**: Use the back button to return to calendar

## 🛠️ Technical Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI** - Component library
- **Styled Components** - CSS-in-JS styling
- **React Context** - State management

## 📁 Project Structure

```
src/
├── components/
│   ├── styled/
│   │   ├── AttendanceContainer.tsx
│   │   ├── CalendarContainer.tsx
│   │   ├── StudentItem.tsx
│   │   └── StatsCard.tsx
│   ├── Calendar.tsx
│   ├── AttendancePage.tsx
│   ├── StudentItem.tsx
│   └── AttendanceStats.tsx
├── context/
│   └── AttendanceContext.tsx
├── types/
│   └── attendance.ts
├── App.tsx
├── index.tsx
└── theme.ts
```

## 🎯 Future Enhancements

- [ ] Data persistence (localStorage/database)
- [ ] Export attendance reports
- [ ] Student management (add/edit/delete)
- [ ] Monthly/yearly attendance summaries
- [ ] Email notifications
- [ ] Mobile app version

## 📄 License

This project is licensed under the MIT License.
