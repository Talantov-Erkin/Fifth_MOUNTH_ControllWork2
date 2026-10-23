import { useLoaderData, useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  Descriptions,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useUpdateProduct } from "../../API/queries";
import styles from "./Product.module.scss";

const { Title } = Typography;

export default function ProductPage() {
  const product = useLoaderData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const isEditMode = searchParams.get("edit") === "true";
  const updateMutation = useUpdateProduct();

  if (isEditMode && form.getFieldValue("title") === undefined) {
    form.setFieldsValue(product);
  }

  const handleUpdate = (values) => {
    if (!values.title.includes("Ivanov"))
      return message.error("Нужна фамилия Ivanov!");
    updateMutation.mutate(
      { id: product.id, data: { ...product, ...values } },
      {
        onSuccess: () => {
          message.success("Обновлено!");
          navigate("/");
        },
      },
    );
  };

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Назад
      </Button>
      {isEditMode ? (
        <Card title="Редактирование" style={{ maxWidth: 600 }}>
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Form.Item
              name="title"
              label="Название"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Цена" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateMutation.isPending}
            >
              Сохранить
            </Button>
          </Form>
        </Card>
      ) : (
        <Card style={{ maxWidth: 800 }}>
          <div className={styles.productView}>
            <img
              src={product.images?.[0]}
              alt={product.title}
              className={styles.productImage}
            />
            <div className={styles.productInfo}>
              <Title level={3}>{product.title}</Title>
              <Title level={4} type="success">
                ${product.price}
              </Title>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Категория">
                  {product.category}
                </Descriptions.Item>
                <Descriptions.Item label="Описание">
                  {product.description}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
