import {
  Link,
  useSearchParams,
  useNavigate,
  useLoaderData,
} from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Select,
  Button,
  Pagination,
  Spin,
  Space,
  Typography,
  Popconfirm,
  message,
  Empty,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useFavoritesStore, useModalStore } from "../../Store/store.js";
import {
  useProducts,
  useCategories,
  useDeleteProduct,
} from "../../API/queries";
import CreateProductModal from "../../components/CreateProductModal.jsx";
import styles from "./Products.module.scss";

const { Title, Text } = Typography;
const LIMIT = 6;
const PLACEHOLDER = "https://placehold.co/600x400";

export default function ProductsPage() {
  const initialData = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const openCreate = useModalStore((state) => state.openCreate);

  const { data, isLoading, isError, error } = useProducts({
    page,
    limit: LIMIT,
    category,
    sort,
  });
  const products = data ?? initialData ?? [];

  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteProduct();

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    if (key !== "page") newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleDelete = (id, title) => {
    if (!title.includes("Ivanov")) {
      messageApi.error("Удалять можно только свои товары!");
      return;
    }
    deleteMutation.mutate(id, {
      onSuccess: () => messageApi.success("Удалено"),
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.center}>
          <Spin size="large" />
        </div>
      );
    }

    if (isError) {
      return (
        <Empty
          description={`Не удалось загрузить товары: ${error?.message ?? ""}`}
        />
      );
    }

    if (products.length === 0) {
      return <Empty description="Товаров нет" />;
    }

    return (
      <Row gutter={[24, 24]}>
        {products.map((product) => {
          const isFav = favorites.some((f) => f.id === product.id);
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.title}
                    src={product.images?.[0] || PLACEHOLDER}
                    className={styles.cardImage}
                  />
                }
                actions={[
                  <Button
                    type="text"
                    key="fav"
                    onClick={() => toggleFavorite(product)}
                  >
                    {isFav ? (
                      <HeartFilled style={{ color: "red" }} />
                    ) : (
                      <HeartOutlined />
                    )}
                  </Button>,
                  <Button
                    type="text"
                    key="edit"
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/product/${product.id}?edit=true`)}
                  />,
                  <Popconfirm
                    key="del"
                    title="Удалить товар?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={() => handleDelete(product.id, product.title)}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
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
          );
        })}
      </Row>
    );
  };

  return (
    <div>
      {contextHolder}
      <CreateProductModal />

      <div className={styles.header}>
        <Title level={2}>Каталог</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Создать
        </Button>
      </div>

      <Space wrap className={styles.filters}>
        <Select
          placeholder="Категория"
          allowClear
          style={{ width: 200 }}
          value={category || undefined}
          onChange={(val) => updateParam("category", val)}
          options={categories.map((c) => ({ label: c.name, value: c.name }))}
        />
        <Select
          placeholder="Сортировка"
          allowClear
          style={{ width: 200 }}
          value={sort || undefined}
          onChange={(val) => updateParam("sort", val)}
          options={[
            { label: "Цена (по возрастанию)", value: "price_asc" },
            { label: "Цена (по убыванию)", value: "price_desc" },
          ]}
        />
      </Space>

      {renderContent()}

      <div className={styles.pagination}>
        <Pagination
          current={page}
          pageSize={LIMIT}
          total={
            products.length < LIMIT
              ? (page - 1) * LIMIT + products.length
              : page * LIMIT + 1
          }
          showSizeChanger={false}
          onChange={(newPage) => updateParam("page", newPage)}
        />
      </div>
    </div>
  );
}