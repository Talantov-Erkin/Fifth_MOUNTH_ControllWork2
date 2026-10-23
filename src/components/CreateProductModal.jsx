import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { useModalStore } from "../Store/store.js";
import { useCategories, useCreateProduct } from "../API/queries";

const PLACEHOLDER = "https://placehold.co/600x400";

export default function CreateProductModal() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const isOpen = useModalStore((state) => state.isCreateOpen);
  const closeCreate = useModalStore((state) => state.closeCreate);

  const { data: categories = [] } = useCategories();
  const createMutation = useCreateProduct();

  const handleClose = () => {
    closeCreate();
    form.resetFields();
  };

  const handleFinish = (values) => {
    createMutation.mutate(
      {
        title: values.title,
        price: values.price,
        category: values.category,
        description: values.description || "",
        images: [values.image || PLACEHOLDER],
      },
      {
        onSuccess: () => {
          messageApi.success("Товар создан!");
          handleClose();
        },
        onError: () => messageApi.error("Не удалось создать товар"),
      },
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Новый товар"
        open={isOpen}
        onCancel={handleClose}
        onOk={() => form.submit()}
        okText="Создать"
        cancelText="Отмена"
        confirmLoading={createMutation.isPending}
        destroyOnHidden
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ title: "Ivanov " }}
        >
          <Form.Item
            name="title"
            label="Название"
            rules={[
              { required: true, message: "Введите название" },
              {
                validator: (_, value) =>
                  !value || value.includes("Ivanov")
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Название должно содержать Ivanov"),
                      ),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Цена"
            rules={[{ required: true, message: "Введите цену" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Категория"
            rules={[{ required: true, message: "Выберите категорию" }]}
          >
            <Select
              placeholder="Выберите категорию"
              options={categories.map((c) => ({
                label: c.name,
                value: c.name,
              }))}
            />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="image" label="Ссылка на картинку">
            <Input placeholder={PLACEHOLDER} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}