import { useRouteError, Link } from "react-router-dom";
import { Result, Button } from "antd";

export default function ErrorPage() {
  const error = useRouteError();
  return (
    <Result
      status="error"
      title="Ошибка"
      subTitle={error?.message || "Что-то пошло не так"}
      extra={
        <Link to="/">
          <Button type="primary">На главную</Button>
        </Link>
      }
    />
  );
}
