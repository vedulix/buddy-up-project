
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Eye, FormInput, TrendingUp } from 'lucide-react';

const AdminPage = () => {
  // Mock data - in real app would fetch from API
  const [stats, setStats] = useState({
    totalVisits: 1247,
    uniqueVisitors: 892,
    filledForms: 156,
    conversionRate: 17.5
  });

  const [funnelData] = useState([
    { step: 'Landing View', count: 892, dropRate: 0 },
    { step: 'CTA Click', count: 234, dropRate: 73.8 },
    { step: 'Form Start', count: 198, dropRate: 15.4 },
    { step: 'Step 2', count: 187, dropRate: 5.6 },
    { step: 'Step 3', count: 175, dropRate: 6.4 },
    { step: 'Step 4', count: 168, dropRate: 4.0 },
    { step: 'Form Submit', count: 156, dropRate: 7.1 }
  ]);

  const [recentApplications] = useState([
    { id: 1, grade: '11', goals: 'ЕГЭ', subjects: 'Математика, Физика', level: '85 баллов', date: '2024-06-03 14:30' },
    { id: 2, grade: '10', goals: 'Олимпиады', subjects: 'Информатика', level: 'Региональный уровень', date: '2024-06-03 13:45' },
    { id: 3, grade: '9', goals: 'ОГЭ', subjects: 'Русский, Математика', level: '78 баллов', date: '2024-06-03 12:20' },
    { id: 4, grade: '11', goals: 'ЕГЭ', subjects: 'Химия, Биология', level: '92 балла', date: '2024-06-03 11:15' },
    { id: 5, grade: '10', goals: 'Проекты', subjects: 'Информатика', level: 'Высокий', date: '2024-06-03 10:30' }
  ]);

  // Simple auth check (in real app would use proper authentication)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Неверный пароль');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-[#FECD02] text-black p-3 rounded-lg font-semibold"
            >
              Войти
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Study Buddy Admin</h1>
          <p className="text-gray-600">Панель управления и аналитика</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего визитов</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVisits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Уникальные посетители</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Заполненные анкеты</CardTitle>
              <FormInput className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.filledForms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Конверсия</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#FECD02]">{stats.conversionRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Funnel Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Воронка конверсий</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Шаг</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead>Отсев %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funnelData.map((step, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{step.step}</TableCell>
                    <TableCell>{step.count}</TableCell>
                    <TableCell>
                      <span className={step.dropRate > 20 ? 'text-red-600' : step.dropRate > 10 ? 'text-yellow-600' : 'text-green-600'}>
                        {step.dropRate}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Последние заявки</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Класс</TableHead>
                  <TableHead>Цели</TableHead>
                  <TableHead>Предметы</TableHead>
                  <TableHead>Уровень</TableHead>
                  <TableHead>Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.grade}</TableCell>
                    <TableCell>{app.goals}</TableCell>
                    <TableCell>{app.subjects}</TableCell>
                    <TableCell>{app.level}</TableCell>
                    <TableCell>{app.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
