import { auth, signIn, signOut } from "../lib/auth";

function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<"button">) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <button type={"submit"} {...props}>
        Sign In
      </button>
    </form>
  );
}

function SignOut(props: React.ComponentPropsWithRef<"button">) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <button type={"submit"} {...props}>
        Sign Out
      </button>
    </form>
  );
}

export default async function Home() {
  const session = await auth();
  let user = null;

  if (session?.user) {
    user = (
      <div className="">
        <h2 className="text-xl font-bold">Current Session Data</h2>
        {Object.keys(session.user).length > 3 ? (
          <p>
            In this example, the whole session object is passed to the page,
            including the raw user object. Our recommendation is to{" "}
            <em>only pass the necessary fields</em> to the page, as the raw user
            object may contain sensitive information.
          </p>
        ) : (
          <p>
            In this example, only some fields in the user object is passed to
            the page to avoid exposing sensitive information.
          </p>
        )}
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <SignIn />
        <SignOut />
        {user}
      </div>
    </main>
  );
}
