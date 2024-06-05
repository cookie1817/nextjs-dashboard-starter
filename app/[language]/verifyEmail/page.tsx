"use client";
import { useRouter } from 'next/navigation';
import Button from "@mui/material/Button";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { useTheme } from '@mui/material/styles';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useSnackbar } from "notistack";
import { useAuthEmailOtpService, useAuthEmailOtpResendService } from "@/service/api/services/auth";
import { HTTP_CODES_ENUM } from "@/service/api/types/http-codes";
import { useTranslation } from "@/service/i18n/client";
import WelcomePageLayout from "@/components/welcome";

import useLanguage from "@/service/i18n/use-language";
import useAuthTokens from "@/service/auth/use-auth-tokens";

type EmailOtpCodeFormData = {
  emailOtpCode: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("verify_email");

  return yup.object().shape({
    emailOtpCode: yup
      .string()
      .matches(/^\d+$/, t("verify_email:inputs.emailOtpCode.validation.digitsOnly"))
      .length(6, t("verify_email:inputs.emailOtpCode.validation.length"))
      .required(t("verify_email:inputs.emailOtpCode.validation.required")),
  });
};

function FormActions() {
  const { t } = useTranslation("verify_email");
  const { isSubmitting } = useFormState();
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
      data-testid="verify-email"
      sx={{
        '&.MuiButton-contained': {
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        },
      }}
    >
      {t("verify_email:actions.verify")}
    </Button>
  );
}

function Form() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const language = useLanguage();
  const { setTokensInfo } = useAuthTokens();

  const fetchAuthEmailOtp = useAuthEmailOtpService();
  const resendAuthEmailOtp = useAuthEmailOtpResendService();
  const { t } = useTranslation("verify_email");
  const validationSchema = useValidationSchema();

  const methods = useForm<EmailOtpCodeFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      emailOtpCode: "",
    },
  });

  const { handleSubmit, setError } = methods;

  const onResend = async () => {
    const { data, status } = await resendAuthEmailOtp();
    if (status > HTTP_CODES_ENUM.TOO_MANY_REQUEST) {
      // TOO_MANY_REQUEST
      enqueueSnackbar(t(`verify_email:inputs.emailOtpCode.validation.server.TOO_MANY_REQUEST`), {
        variant: "error",
      });
      return
    } else if (status === HTTP_CODES_ENUM.CONFLICT) {
      // EMAIL_ALREADY_VERIFIED, redirect to dashboard
      enqueueSnackbar(t("verify_email:alerts.verified"), {
        variant: "success",
      });
      setTokensInfo({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpires: data.tokenExpires,
      });
      // setUser(data.user);
      router.push('/' + language + '/dashboard');
    }

    if (status === HTTP_CODES_ENUM.OK) {
      // EMAIL_ALREADY_VERIFIED, redirect to dashboard
      enqueueSnackbar(t("verify_email:alerts.success"), {
        variant: "success",
      });
    }
  }

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthEmailOtp(formData);

    if (status === HTTP_CODES_ENUM.UNAUTHORIZED) {
      // OTP_CODE_NOT_MATCH 
      setError('emailOtpCode', {
        type: "manual",
        message: t(
          `verify_email:inputs.emailOtpCode.validation.server.OTP_CODE_NOT_MATCH`
        ),
      });
      return;
    } else if (status === HTTP_CODES_ENUM.GONE) {
      // OTP_EXPIRED, resend otp code to eamil
      enqueueSnackbar(t(`verify_email:inputs.emailOtpCode.validation.server.OTP_EXPIRED`), {
        variant: "error",
      });
      return
    }

    if (status === HTTP_CODES_ENUM.OK || status === HTTP_CODES_ENUM.CONFLICT) {
      // EMAIL_ALREADY_VERIFIED, redirect to dashboard
      enqueueSnackbar(t("verify_email:alerts.verified"), {
        variant: "success",
      });
      setTokensInfo({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpires: data.tokenExpires,
      });
      // setUser(data.user);
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
                <Typography variant="h6">{t("verify_email:verifyEmail")}</Typography>
                </Grid>
                <Grid item xs={12}>
                <FormTextInput<EmailOtpCodeFormData>
                    name="emailOtpCode"
                    label={t("verify_email:inputs.emailOtpCode.label")}
                    testId="otpCode"
                />
                </Grid>

                <Grid item xs={12}>
                <FormActions />
                </Grid>

                <Grid item xs={8} direction="row">
                  <Typography variant="body1">{t("verify_email:notReceivedOtpCode")}</Typography>
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={onResend}
                  >
                    {t("verify_email:actions.resend")}
                  </Button>
                </Grid>
                {/* <Grid item xs={5}>
                  <Button
                    variant="text"
                    color="inherit"
                    // LinkComponent={Link}
                    // href="/login"
                    // data-testid="login"
                  >
                    {t("verify_email:actions.resend")}
                  </Button>
                </Grid> */}
            </Grid>
            </form>
        </Container>
        </FormProvider>
    </WelcomePageLayout>
  );
}

function VerifyEmail() {
  return <Form />;
}

export default VerifyEmail;
