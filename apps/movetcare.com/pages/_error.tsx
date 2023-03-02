function Error({ statusCode }: { statusCode: number }) {
  return (
    <pre>
      <p className="text-movet-red">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </p>
    </pre>
  );
}

Error.getInitialProps = ({
  res,
  err,
}: {
  res: { statusCode: number };
  err: { statusCode: number };
}) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
