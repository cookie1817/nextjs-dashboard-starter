"use client";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useAuthLoginService,
  useAuthSignUpService,
} from "@/service/api/services/auth";
import useAuthActions from "@/service/auth/use-auth-actions";
import useAuthTokens from "@/service/auth/use-auth-tokens";
import { useSnackbar } from "notistack";
import { useTheme } from '@mui/material/styles';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import WelcomePageLayout from "@/components/welcome";
import FormTextInput from "@/components/form/text-input/form-text-input";
import Link from "@/components/link";
import Box from "@mui/material/Box";

// import withPageRequiredGuest from "@/services/auth/with-page-required-guest";
import { HTTP_CODES_ENUM, ErrorCodes} from "@/service/api/types/http-codes";
import { useTranslation } from "@/service/i18n/client";


type SignUpFormData = {
  name: string;
  business_name: string;
  email: string;
  password: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("signup");

  return yup.object().shape({
    name: yup
      .string()
      .required(t("signup:inputs.name.validation.required")),
    business_name: yup
      .string()
      .required(t("signup:inputs.businessName.validation.required")),
    email: yup
      .string()
      .email(t("signup:inputs.email.validation.invalid"))
      .required(t("signup:inputs.email.validation.required")),
    password: yup
      .string()
      .min(6, t("signup:inputs.password.validation.min"))
      .required(t("signup:inputs.password.validation.required")),
  });
};

function FormActions() {
  const { t } = useTranslation("signup");
  const theme = useTheme();
  const { isSubmitting } = useFormState();

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
      data-testid="signup-submit"
      sx={{
        '&.MuiButton-contained': {
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        },
      }}
    >
      {t("signup:actions.submit")}
    </Button>
  );
}

function Form() {
  const { enqueueSnackbar } = useSnackbar();
  const { setUser } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();
  const fetchAuthLogin = useAuthLoginService();
  const fetchAuthSignUp = useAuthSignUpService();
  const { t } = useTranslation("signup");
  const validationSchema = useValidationSchema();

  const methods = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      business_name: "",
      email: "",
      password: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {

    const { data: dataSignUp, status: statusCode } =
      await fetchAuthSignUp(formData);

    if (statusCode == HTTP_CODES_ENUM.BAD_REQUEST) {
      dataSignUp?.message.forEach(
        (message) => {
          setError(message.field, {
            type: "manual",
            message: t(
              `signup:inputs.${message.field}.validation.server.${message.message}`
            ),
          });
        }
      );

      return;
    } else if (statusCode == HTTP_CODES_ENUM.CONFLICT) {
      let field;
      if(dataSignUp?.error_code === ErrorCodes.BUSINESS_NAME_EXISTED) {
        field = 'business_name'
      } else if(dataSignUp?.error_code === ErrorCodes.EMAIL_EXISTED) {
        field = 'email'
      }
      if (field) {
        setError(field, {
          type: "manual",
          message: t(
            `signup:inputs.${field}.validation.server.${dataSignUp?.error_code}`
          ),
        });
        return
      }
    } else if (statusCode > HTTP_CODES_ENUM.BAD_REQUEST) {
      enqueueSnackbar(t("common:server_error"), {
        variant: "error",
      });
      return
    }

    const { data: dataSignIn, status: statusSignIn } = await fetchAuthLogin({
      email: formData.email,
      password: formData.password,
    });

    if (statusSignIn === HTTP_CODES_ENUM.OK) {
      setTokensInfo({
        token: dataSignIn.token,
        refreshToken: dataSignIn.refreshToken,
        tokenExpires: dataSignIn.tokenExpires,
      });
      setUser(dataSignIn.user);
    }
  });

  return (
    <WelcomePageLayout>
      <FormProvider {...methods}>
        <Container maxWidth="xs">
          <form onSubmit={onSubmit}>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} mt={3}>
                <Typography variant="h6">{t("signup:signup")}</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormTextInput<SignUpFormData>
                  name="name"
                  label={t("signup:inputs.name.label")}
                  type="text"
                  autoFocus
                  testId="name"
                />
              </Grid>

              <Grid item xs={12}>
                <FormTextInput<SignUpFormData>
                  name="business_name"
                  label={t("signup:inputs.businessName.label")}
                  type="text"
                  testId="business-name"
                />
              </Grid>

              <Grid item xs={12}>
                <FormTextInput<SignUpFormData>
                  name="email"
                  label={t("signup:inputs.email.label")}
                  type="email"
                  testId="email"
                />
              </Grid>

              <Grid item xs={12}>
                <FormTextInput<SignUpFormData>
                  name="password"
                  label={t("signup:inputs.password.label")}
                  type="password"
                  testId="password"
                />
              </Grid>

              <Grid item xs={12}>
                <FormActions />
                <Box ml={1} component="span">
                  <Button
                    variant="contained"
                    color="inherit"
                    LinkComponent={Link}
                    data-testid="login"
                    href="/login"
                  >
                    {t("signup:actions.accountAlreadyExists")}
                  </Button>
                </Box>
              </Grid>

            </Grid>
          </form>
        </Container>
      </FormProvider>
    </WelcomePageLayout>
  );
}

function SignUp() {
  return <Form />;
}

export default SignUp;
