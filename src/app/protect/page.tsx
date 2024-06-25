import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Middleware usage</h1>
      <p>This page is protected by using the universal</p>
      {session?.user && (
        <div className="">
          <h2 className="text-xl font-bold">Current Session Data</h2>
          {Object.keys(session.user).length > 3 ? (
            <p>
              In this example, the whole session object is passed to the page,
              including the raw user object. Our recommendation is to{" "}
              <em>only pass the necessary fields</em> to the page, as the raw
              user object may contain sensitive information.
            </p>
          ) : (
            <p>
              In this example, only some fields in the user object is passed to
              the page to avoid exposing sensitive information.
            </p>
          )}
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
