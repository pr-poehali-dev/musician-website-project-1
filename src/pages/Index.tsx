import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import ShoppingCart from '@/components/ShoppingCart';

interface Track {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: number;
  description: string;
  audioUrl?: string;
}

const tracks: Track[] = [
  { id: 1, title: 'Весёлый ёжик', category: 'children', duration: '2:30', price: 299, description: 'Детская песня о приключениях весёлого ёжика', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Радуга после дождя', category: 'children', duration: '3:15', price: 299, description: 'Добрая мелодия о красоте природы', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Осенний вальс', category: 'adult', duration: '4:20', price: 499, description: 'Лирическая композиция об осени', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, title: 'Дорога домой', category: 'adult', duration: '3:45', price: 499, description: 'Трогательная песня о возвращении', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 5, title: 'Ave Maria', category: 'choral', duration: '5:30', price: 799, description: 'Хоровая обработка классической молитвы', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 6, title: 'Реквием для хора', category: 'choral', duration: '8:00', price: 899, description: 'Торжественное хоровое произведение', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 7, title: 'Симфония No.1', category: 'orchestral', duration: '12:00', price: 1299, description: 'Оркестровая симфония в 3 частях', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 8, title: 'Концерт для скрипки', category: 'orchestral', duration: '15:30', price: 1499, description: 'Виртуозный скрипичный концерт', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
];

const blogPosts = [
  { id: 1, title: 'О процессе создания музыки', date: '15 октября 2024', excerpt: 'Как рождается мелодия и что вдохновляет композитора...' },
  { id: 2, title: 'Работа с хором', date: '3 октября 2024', excerpt: 'Особенности написания хоровых партитур и аранжировок...' },
];

interface CartItem {
  id: number;
  title: string;
  price: number;
  category: string;
}

export default function Index() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setPlayingTrackId(null);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlayPause = (track: Track) => {
    if (!audioRef.current) return;

    if (playingTrackId === track.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (playingTrackId !== track.id) {
        audioRef.current.src = track.audioUrl || '';
        setPlayingTrackId(track.id);
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const addToCart = (track: Track) => {
    if (cart.some(item => item.id === track.id)) {
      toast({
        title: 'Уже в корзине',
        description: 'Эта композиция уже добавлена в корзину',
        variant: 'destructive'
      });
      return;
    }

    const cartItem: CartItem = {
      id: track.id,
      title: track.title,
      price: track.price,
      category: getCategoryName(track.category)
    };

    setCart([...cart, cartItem]);
    toast({
      title: 'Добавлено в корзину',
      description: `"${track.title}" добавлена в корзину`
    });
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
    toast({
      title: 'Удалено',
      description: 'Композиция удалена из корзины'
    });
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: 'Корзина очищена',
      description: 'Все композиции удалены из корзины'
    });
  };

  const filteredTracks = activeCategory === 'all' 
    ? tracks 
    : tracks.filter(track => track.category === activeCategory);

  const getCategoryName = (cat: string) => {
    const names: Record<string, string> = {
      'all': 'Все композиции',
      'children': 'Детские песни',
      'adult': 'Песни для взрослых',
      'choral': 'Хоровая музыка',
      'orchestral': 'Оркестровая музыка'
    };
    return names[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Music" size={32} className="text-primary" />
            <h1 className="text-2xl font-bold">Роман Самолетов</h1>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#music" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">Музыка</a>
            <a href="#blog" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">Блог</a>
            <a href="#contact" className="hidden md:block text-sm font-medium hover:text-primary transition-colors">Контакты</a>
            <ShoppingCart cart={cart} onRemoveFromCart={removeFromCart} onClearCart={clearCart} />
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://cdn.poehali.dev/projects/b75fbcef-5287-4b17-8bf7-723a4d07efcc/files/c031dd0d-82bd-458c-9f3c-2d436d90ca61.jpg" 
            alt="Music background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6 music-note">
              <Icon name="Music2" size={40} className="text-accent" />
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              Сайт музыканта, композитора<br />Романа Самолетова
            </h2>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button size="lg" className="text-lg">
                <Icon name="PlayCircle" size={20} className="mr-2" />
                Послушать музыку
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                <Icon name="FileText" size={20} className="mr-2" />
                Купить ноты
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="music" className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">Каталог композиций</h3>
            <p className="text-xl text-muted-foreground">Музыка на любой вкус и случай</p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-2 md:grid-cols-5 mb-12 h-auto gap-2">
              <TabsTrigger value="all" className="text-sm md:text-base">Все</TabsTrigger>
              <TabsTrigger value="children" className="text-sm md:text-base">Детские</TabsTrigger>
              <TabsTrigger value="adult" className="text-sm md:text-base">Взрослые</TabsTrigger>
              <TabsTrigger value="choral" className="text-sm md:text-base">Хоровые</TabsTrigger>
              <TabsTrigger value="orchestral" className="text-sm md:text-base">Оркестровые</TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTracks.map((track, index) => (
                  <Card key={track.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in group" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader className="bg-gradient-to-br from-primary/20 to-accent/20 pb-20 relative overflow-hidden">
                      <div className="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Icon name="Music4" size={120} />
                      </div>
                      <Badge className="mb-2 w-fit">{getCategoryName(track.category)}</Badge>
                      <CardTitle className="text-2xl">{track.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="mb-4 text-base">{track.description}</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={16} />
                          {track.duration}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-accent">
                          <Icon name="Tag" size={16} />
                          {track.price} ₽
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button className="flex-1" onClick={() => addToCart(track)}>
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        Купить
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => togglePlayPause(track)}
                        className={playingTrackId === track.id && isPlaying ? 'bg-primary text-primary-foreground' : ''}
                      >
                        <Icon name={playingTrackId === track.id && isPlaying ? 'Pause' : 'Play'} size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section id="blog" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">Блог</h3>
            <p className="text-xl text-muted-foreground">Мысли о музыке и творчестве</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Icon name="Calendar" size={16} />
                    {post.date}
                  </div>
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="gap-2">
                    Читать далее
                    <Icon name="ArrowRight" size={16} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-card/30">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Свяжитесь со мной</h3>
            <p className="text-xl text-muted-foreground mb-8">
              Заказ музыки, сотрудничество, вопросы о композициях
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="outline" className="gap-2">
                <Icon name="Mail" size={20} />
                Email
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Icon name="Phone" size={20} />
                Телефон
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Icon name="MessageCircle" size={20} />
                Telegram
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2024 Роман Самолетов. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}