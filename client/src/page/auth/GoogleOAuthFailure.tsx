import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useStoreBase } from "@/store/store"; // use your correctly typed store

const GoogleOAuthFailure = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Access setAccessToken properly
  const setAccessToken = useStoreBase((state) => state.setAccessToken);

  const accessToken = params.get("access_token");
  const currentWorkspace = params.get("currentWorkspace");

  React.useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      if (currentWorkspace) {
        navigate(`/workspace/${currentWorkspace}`);
      } else {
        navigate(`/`);
      }
    }
  }, [accessToken, currentWorkspace, navigate, setAccessToken]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
          Standing Together.
        </Link>
      </div>

      <Card>
        <CardContent>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Authentication Failed</h1>
            <p>We couldn't sign you in with Google. Please try again.</p>

            <Button onClick={() => navigate("/")} style={{ marginTop: "20px" }}>
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleOAuthFailure;
