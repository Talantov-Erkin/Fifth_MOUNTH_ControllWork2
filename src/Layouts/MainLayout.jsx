import { Outlet, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Badge } from 'antd';
import { HeartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useFavoritesStore } from '../Store/store.js';
import styles from './MainLayout.module.scss';

const { Header, Content } = Layout;

export default function MainLayout() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const location = useLocation();

  const menuItems = [
    { 
      key: '/', 
      icon: <ShoppingOutlined />, 
      label: <Link to="/">Каталог</Link> 
    },
    {
      key: '/favorites',
      icon: <HeartOutlined />,
      label: (
        <Link to="/favorites">
          Избранное <Badge count={favorites.length} size="small" />
        </Link>
      ),
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Mini Market
        </Link>
        <Menu 
          mode="horizontal" 
          selectedKeys={[location.pathname]} 
          items={menuItems} 
          className={styles.menu} 
        />
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
}