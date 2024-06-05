"use client";
import Button from "@mui/material/Button";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useAuthResetPasswordService } from "@/service/api/services/auth";
import useLanguage from "@/service/i18n/use-language";

import { useTheme } from '@mui/material/styles';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import Link from '@/components/link';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { HTTP_CODES_ENUM } from "@/service/api/types/http-codes";
import { useTranslation } from "@/service/i18n/client";

import WelcomePageLayout from "@/components/welcome";

type ResetPasswordFormData = {
  password: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("reset_password");

  return yup.object().shape({
    password: yup
      .string()
      .min(6, t("reset_password:inputs.password.validation.min"))
      .required(t("reset_password:inputs.password.validation.required")),
    passwordConfirmation: yup.string()
      .oneOf([yup.ref('password'), undefined], t("reset_password:inputs.password.validation.notMatched"))
  });
};

function FormActions() {
  const { t } = useTranslation("reset_password");
  const { isSubmitting } = useFormState();
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
      data-testid="send-email"
      sx={{
        '&.MuiButton-contained': {
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        },
      }}
    >
      {t("reset_password:actions.submit")}
    </Button>
  );
}

function Form() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const language = useLanguage();
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const fetchAuthResetPassword = useAuthResetPasswordService();
  const { t } = useTranslation("reset_password");
  const validationSchema = useValidationSchema();

  const methods = useForm<ResetPasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      password: "",
      token
    },
  });


  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthResetPassword(formData);

    if (status === HTTP_CODES_ENUM.UNAUTHORIZED) {
      // UNAUTHORIZED, INVALID_TOKEN
      enqueueSnackbar(t("reset_password:alerts.UNAUTHORIZED"), {
        variant: "error",
      });
      router.push('/' + language + '/dashboard');
      return;
    };

    if (status === HTTP_CODES_ENUM.OK) {
      enqueueSnackbar(t("reset_password:alerts.success"), {
        variant: "success",
      });
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
                <Typography variant="h6">{t("reset_password:resetPassword")}</Typography>
                </Grid>
                <Grid item xs={12}>
                <FormTextInput<ResetPasswordFormData>
                  name="password"
                  label={t("reset_password:inputs.password.label")}
                  type="password"
                  testId="password"
                />
              </Grid>

              <Grid item xs={12}>
                <FormTextInput<ResetPasswordFormData>
                  name="passwordConfirmation"
                  label={t("reset_password:inputs.passwordConfirmation.label")}
                  type="password"
                  testId="comfirmedPassword"
                />
              </Grid>

                <Grid item xs={12}>
                  <FormActions />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="inherit"
                        LinkComponent={Link}
                        href="/login"
                        data-testid="login"
                    >
                        {t("reset_password:actions.back")}
                    </Button>
                </Grid>

            </Grid>
            </form>
        </Container>
        </FormProvider>
    </WelcomePageLayout>
  );
}

function ResetPassword() {
  return <Form />;
}

export default ResetPassword;