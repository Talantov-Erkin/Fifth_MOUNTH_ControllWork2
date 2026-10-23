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
import { useFavoritesStore } from '../../Store/store.js';
import {
  useProducts,
  useCategories,
  useCreateProduct,
  useDeleteProduct,
} from "../../API/queries";
import styles from "./Products.module.scss";

const { Title, Text } = Typography;
const LIMIT = 6;

export default function ProductsPage() {
  const initialData = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  const { toggleFavorite, favorites } = useFavoritesStore();
  const { data: products = initialData || [], isLoading } = useProducts({
    page,
    limit: LIMIT,
    category,
    sort,
  });
  const { data: categories = [] } = useCategories();

  const createMutation = useCreateProduct();
  const deleteMutation = useDeleteProduct();

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    if (key !== "page") newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleCreate = () => {
    createMutation.mutate(
      {
        title: "Ivanov New Product",
        price: 100,
        description: "Created from app",
        category: "Clothes",
        images: ["https://placehold.co/600x400"],
      },
      { onSuccess: () => message.success("Товар создан!") },
    );
  };

  const handleDelete = (id, title) => {
    if (!title.includes("Ivanov"))
      return message.error("Удалять можно только свои товары!");
    deleteMutation.mutate(id, { onSuccess: () => message.success("Удалено") });
  };

  return (
    <div>
      <div className={styles.header}>
        <Title level={2}>Каталог</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          loading={createMutation.isPending}
        >
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

      {isLoading ? (
        <div className={styles.center}>
          <Spin size="large" />
        </div>
      ) : products.length === 0 ? (
        <Empty description="Товаров нет" />
      ) : (
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
                      src={
                        product.images?.[0] || "https://placehold.co/600x400"
                      }
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
                      onClick={() =>
                        navigate(`/product/${product.id}?edit=true`)
                      }
                    />,
                    <Popconfirm
                      key="del"
                      title="Удалить?"
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
      )}

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
