import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Typography, Empty } from "antd";
import { DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useFavoritesStore } from '../../Store/store.js';
import styles from "./Favorites.module.scss";

const { Title, Text } = Typography;

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavoritesStore();

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/")}
        style={{ marginBottom: 16 }}
      >
        Назад
      </Button>
      <Title level={2}>Избранное</Title>
      {favorites.length === 0 ? (
        <Empty description="Пусто" />
      ) : (
        <Row gutter={[24, 24]}>
          {favorites.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.title}
                    src={product.images?.[0]}
                    className={styles.cardImage}
                  />
                }
                actions={[
                  <Button
                    type="text"
                    danger
                    key="del"
                    icon={<DeleteOutlined />}
                    onClick={() => toggleFavorite(product)}
                  />,
                ]}
              >
                <Card.Meta
                  title={
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                  }
                  description={<Text strong>${product.price}</Text>}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
