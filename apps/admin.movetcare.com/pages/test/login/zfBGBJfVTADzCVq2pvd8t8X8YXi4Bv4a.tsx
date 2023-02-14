import { GetStaticProps } from "next/types";

export const getStaticProps: GetStaticProps = async () => {
  if (process.env.NODE_ENV === "production") return { notFound: true };
  else return { props: {} };
};

const TestAuthLogin = ({ notFound }: { notFound: boolean | undefined }) =>
  notFound ? <p>NOT FOUND</p> : <p>HELLO!</p>;

export default TestAuthLogin;
