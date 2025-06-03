
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Eye, FormInput, TrendingUp } from 'lucide-react';
import { analytics } from '@/utils/analytics';

const AdminPage = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    filledForms: 0,
    conversionRate: 0
  });

  const [funnelData, setFunnelData] = useState<Array<{step: string, count: number, dropRate: number}>>([]);
  const [recentApplications, setRecentApplications] = useState<Array<any>>([]);

  // Simple auth check
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadRealData();
    }
  }, [isAuthenticated]);

  const loadRealData = () => {
    const realStats = analytics.getStats();
    setStats(realStats);
    
    const realFunnelData = analytics.getFunnelData();
    setFunnelData(realFunnelData);
    
    const realApplications = analytics.getRecentApplications(10);
    setRecentApplications(realApplications);
  };

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
            <CardTitle>🔐 Admin Panel</CardTitle>
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
              🚀 Войти
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
          <h1 className="text-3xl font-bold text-black mb-2">📊 Study Buddy Admin</h1>
          <p className="text-gray-600">Панель управления и аналитика (реальные данные)</p>
          <button
            onClick={loadRealData}
            className="mt-2 bg-[#FECD02] text-black px-4 py-2 rounded-lg font-semibold"
          >
            🔄 Обновить данные
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">👀 Всего визитов</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVisits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">👥 Уникальные посетители</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">📝 Заполненные анкеты</CardTitle>
              <FormInput className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.filledForms}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">📈 Конверсия</CardTitle>
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
            <CardTitle>🔍 Воронка конверсий (реальные данные)</CardTitle>
          </CardHeader>
          <CardContent>
            {funnelData.length > 0 ? (
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
            ) : (
              <p className="text-gray-500">Пока нет данных для отображения</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Последние заявки (реальные данные)</CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
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
            ) : (
              <p className="text-gray-500">Пока нет заявок</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
