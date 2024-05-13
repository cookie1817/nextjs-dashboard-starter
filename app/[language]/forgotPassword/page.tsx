"use client";
import Button from "@mui/material/Button";
// import withPageRequiredGuest from "@/service/auth/with-page-required-guest";
import { useForm, FormProvider, useFormState } from "react-hook-form";
// import { useAuthForgotPasswordService } from "@/service/api/services/auth";
import { useTheme } from '@mui/material/styles';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import Link from '@/components/link';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useSnackbar } from "notistack";
// import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/service/i18n/client";

import WelcomePageLayout from "@/components/welcome";

type ForgotPasswordFormData = {
  email: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("forgot_password");

  return yup.object().shape({
    email: yup
      .string()
      .email(t("forgot_password:inputs.email.validation.invalid"))
      .required(t("forgot_password:inputs.email.validation.required")),
  });
};

function FormActions() {
  const { t } = useTranslation("forgot_password");
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
      {t("forgot_password:actions.submit")}
    </Button>
  );
}

function Form() {
//   const { enqueueSnackbar } = useSnackbar();
//   const fetchAuthForgotPassword = useAuthForgotPasswordService();
  const { t } = useTranslation("forgot_password");
  const validationSchema = useValidationSchema();

  const methods = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    // const { data, status } = await fetchAuthForgotPassword(formData);

    // if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
    //   (Object.keys(data.errors) as Array<keyof ForgotPasswordFormData>).forEach(
    //     (key) => {
    //       setError(key, {
    //         type: "manual",
    //         message: t(
    //           `forgotpassword:inputs.${key}.validation.server.${data.errors[key]}`
    //         ),
    //       });
    //     }
    //   );

    //   return;
    // }

    // if (status === HTTP_CODES_ENUM.NO_CONTENT) {
    //   enqueueSnackbar(t("forgotpassword:alerts.success"), {
    //     variant: "success",
    //   });
    // }
  });

  return (
    <WelcomePageLayout>
        <FormProvider {...methods}>
        <Container maxWidth="xs">
            <form onSubmit={onSubmit}>
            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} mt={3}>
                <Typography variant="h6">{t("forgot_password:forgotPassword")}</Typography>
                </Grid>
                <Grid item xs={12}>
                <FormTextInput<ForgotPasswordFormData>
                    name="email"
                    label={t("forgot_password:inputs.email.label")}
                    type="email"
                    testId="email"
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
                        {t("forgot_password:actions.back")}
                    </Button>
                </Grid>
            </Grid>
            </form>
        </Container>
        </FormProvider>
    </WelcomePageLayout>
  );
}

function ForgotPassword() {
  return <Form />;
}

// export default withPageRequiredGuest(ForgotPassword);
export default ForgotPassword;
