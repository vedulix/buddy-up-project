
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
  const [utmStats, setUtmStats] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  // Simple auth check
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadRealData();
    }
  }, [isAuthenticated]);

  const loadRealData = async () => {
    setLoading(true);
    try {
      const [realStats, realFunnelData, realApplications, utmData] = await Promise.all([
        analytics.getStats(),
        analytics.getFunnelData(),
        analytics.getRecentApplications(10),
        analytics.getUTMStats()
      ]);

      setStats(realStats);
      setFunnelData(realFunnelData);
      setRecentApplications(realApplications);
      setUtmStats(utmData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FECD02] mx-auto"></div>
          <p className="mt-4 text-gray-600">Загружаем данные аналитики...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">📊 Study Buddy Admin</h1>
          <p className="text-gray-600">Панель управления и аналитика (данные из Supabase)</p>
          <button
            onClick={loadRealData}
            className="mt-2 bg-[#FECD02] text-black px-4 py-2 rounded-lg font-semibold"
            disabled={loading}
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
            <CardTitle>🔍 Воронка конверсий (данные из Supabase)</CardTitle>
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📋 Последние заявки (данные из Supabase)</CardTitle>
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

        {/* UTM ANALYTICS SECTION */}
        <Card>
          <CardHeader>
            <CardTitle>📊 UTM Analytics — по источникам трафика</CardTitle>
          </CardHeader>
          <CardContent>
            {utmStats.length === 0 ? (
              <p className="text-gray-500">Нет данных по переходам с UTM-метками</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>UTM Source</TableHead>
                    <TableHead>UTM Campaign</TableHead>
                    <TableHead>Клики</TableHead>
                    <TableHead>Заявки</TableHead>
                    <TableHead>Конверсия (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {utmStats.map((u, i) => (
                    <TableRow key={i}>
                      <TableCell>{u.utm_source}</TableCell>
                      <TableCell>{u.utm_campaign || <span className="text-gray-400 italic">-</span>}</TableCell>
                      <TableCell>{u.clicks}</TableCell>
                      <TableCell>{u.submissions}</TableCell>
                      <TableCell>
                        <span className={u.conversion > 10 ? 'text-green-600' : u.conversion > 2 ? 'text-yellow-700' : 'text-gray-800 font-semibold'}>
                          {u.conversion}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="mt-2 text-xs text-gray-500">
              <span className="italic">
                UTM-параметры (utm_source/utm_campaign) — переходы и заявки для отслеживания маркетинговых кампаний (например, постов в Telegram).
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
