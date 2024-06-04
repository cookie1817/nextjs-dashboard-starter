'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import * as yup from "yup";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useTranslation } from "@/service/i18n/client";
import { yupResolver } from "@hookform/resolvers/yup";

import { useSnackbar } from "notistack";
import { useTheme } from '@mui/material/styles';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinkItem from "@mui/material/Link";

import { useAuthLoginService } from "@/service/api/services/auth";
import useAuthTokens from "@/service/auth/use-auth-tokens";
import useAuthActions from "@/service/auth/use-auth-actions";

import Link from '@/components/link';
import FormTextInput from "@/components/form/text-input/form-text-input";
import WelcomePageLayout from "@/components/welcome";

import { HTTP_CODES_ENUM, ErrorCodes} from "@/service/api/types/http-codes";
import useLanguage from "@/service/i18n/use-language";

type SignInFormData = {
  email: string;
  password: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("login");

  return yup.object().shape({
    email: yup
      .string()
      .email(t("login:inputs.email.validation.invalid"))
      .required(t("login:inputs.email.validation.required")),
    password: yup
      .string()
      .min(6, t("login:inputs.password.validation.min"))
      .required(t("login:inputs.password.validation.required")),
  });
};

function FormActions() {
  const { t } = useTranslation("login");
  const theme = useTheme();
  const { isSubmitting } = useFormState();

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
      data-testid="login-submit"
      sx={{
        '&.MuiButton-contained': {
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        },
      }}
    >
      {t("login:actions.submit")}
    </Button>
  );
}

export const Login = () => {
  const { t } = useTranslation("login");
  const router = useRouter();
  const language = useLanguage();
  const validationSchema = useValidationSchema();
  const { enqueueSnackbar } = useSnackbar();
  const fetchAuthLogin = useAuthLoginService();
  const { setTokensInfo } = useAuthTokens();
  const { setUser } = useAuthActions();
  

  const methods = useForm<SignInFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthLogin(formData);

    if (status === HTTP_CODES_ENUM.BAD_REQUEST) {
      
      setError('email', {
        type: "manual",
        message: t(
          `login:inputs.email.validation.server.WRONG_EMAIL_AND_PASSWORD`
        ),
      });

      setError('password', {
        type: "manual",
        message: t(
          `login:inputs.password.validation.server.WRONG_EMAIL_AND_PASSWORD`
        ),
      });

      return;
    } else if (status > HTTP_CODES_ENUM.BAD_REQUEST) {
      enqueueSnackbar(t("common:server_error"), {
        variant: "error",
      });
      return
    }

    if (status === HTTP_CODES_ENUM.OK) {
      setTokensInfo({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpires: data.tokenExpires,
      });
      setUser(data.user);
      router.push('/' + language + '/dashboard');
    }
  });

  return (
    <WelcomePageLayout>
        <FormProvider {...methods}>
            <Container maxWidth="xs">
              <form onSubmit={onSubmit}>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} mt={3}>
                    <Typography variant="h6">{t("login")}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextInput<SignInFormData>
                      name="email"
                      label={t("login:inputs.email.label")}
                      type="email"
                      testId="email"
                      autoFocus
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormTextInput<SignInFormData>
                      name="password"
                      label={t("login:inputs.password.label")}
                      type="password"
                      testId="password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LinkItem
                      component={Link}
                      href="/forgotPassword"
                      data-testid="forgotPassword"
                    >
                      {t("login:actions.forgotPassword")}
                    </LinkItem>
                  </Grid>

                  <Grid item xs={12}>
                    <FormActions />

                    <Box ml={1} component="span">
                      <Button
                        variant="contained"
                        color="inherit"
                        LinkComponent={Link}
                        href="/signup"
                        data-testid="create-account"
                      >
                        {t("login:actions.createAccount")}
                      </Button>
                      </Box>
                  </Grid>
                </Grid>
              </form>
            </Container>
          </FormProvider>
    </WelcomePageLayout>
  )
}

export default Login;