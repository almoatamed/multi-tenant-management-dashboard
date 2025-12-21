import { ThemedView } from "@/components/ThemedView";
import { dc } from "kt-dc";
import { useLocale } from "vuetify";
import { VForm } from "vuetify/components";
import TextField from "@/components/TextField/index.vue";
import { rules } from "@/utils/clientValidationRules";
import { ref } from "vue";
import { extractApiError, type ApiError } from "@/utils/errors/extractor";
import { api } from "@/state/api";
import { urlsMap } from "@/constants/urlsMap";
import { setUserState, type User } from "@/state/user";
import router from "@/router";
import { isDev } from "@/constants/env";
import "./style.css";

const LoginScreen = dc(() => {
    const { t, rtl } = useLocale();
    const username = ref(null as null | string);
    const password = ref(null as null | string);

    onMounted(() => {
        if (isDev()) {
            username.value = "admin";
            password.value = "admin@123";
        }
    });

    const showPassword = ref(false);
    const valid = ref(false);
    const loading = ref(false);

    const errMsg = ref(null as null | ApiError);

    const submit = async () => {
        if (loading.value) {
            return;
        }
        loading.value = true;
        errMsg.value = null;
        try {
            const response: {
                token: string;
                user: User;
            } = (
                await api.post(urlsMap.authLogin, {
                    username: username.value,
                    password: password.value,
                })
            ).data;
            console.log(response);

            setUserState({
                token: response.token,
                userInfo: response.user,
            });
            await nextTick();
            router.push({
                path: "/",
            });
        } catch (error: any) {
            console.error(error);
            const e = extractApiError(error);
            if (e) {
                errMsg.value = e;
            }
        } finally {
            loading.value = false;
        }
    };

    return () => {
        return (
            <ThemedView
                style={{
                    height: "100%",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "stretch",
                    direction: "ltr",
                }}
                class={"rotating-gradient"}
            >
                <ThemedView
                    style={{
                        flex: 2,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0px 22px",
                        gap: "12px",
                    }}
                ></ThemedView>
                <ThemedView
                    style={{
                        flex: 1,
                        alignItems: "stretch",
                        justifyContent: "center",
                        padding: "12px 22px",
                        gap: "12px",
                        direction: rtl.value ? "rtl" : "ltr",
                        backgroundColor: "white",
                    }}
                >
                    <ThemedView
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* <img
                            src={vtLogoPng}
                            style={{
                                width: "250px",
                            }}
                        ></img> */}
                    </ThemedView>
                    <ThemedView
                        style={{
                            // boxShadow: defaultBoxShadow,
                            width: "100%",
                            maxWidth: "600px",
                            padding: "12px",
                            gap: "12px",
                            // backgroundColor: "white",
                            borderRadius: "12px",
                        }}
                    >
                        <ThemedView
                            style={{
                                padding: "0px 12px",
                            }}
                        >
                            <ThemedView
                                style={{
                                    fontSize: "32px",
                                    fontWeight: "500",
                                }}
                            >
                                {t("Login")}
                            </ThemedView>
                        </ThemedView>
                        <VForm
                            style={{ flex: 1 }}
                            onSubmit={(e) => {
                                e.preventDefault();

                                submit();
                            }}
                            onUpdate:modelValue={(v) => {
                                valid.value = !!v;
                            }}
                            disabled={loading.value}
                        >
                            <ThemedView
                                style={{
                                    gap: "12px",
                                }}
                            >
                                <TextField
                                    label={t("Username")}
                                    type="text"
                                    name="username"
                                    rules={[rules.required("Username"), rules.title("Username")]}
                                    modelValue={username.value}
                                    onUpdate:modelValue={(v) => {
                                        username.value = v;
                                    }}
                                ></TextField>

                                <TextField
                                    appendInnerIcon={showPassword.value ? "mdi-eye" : "mdi-eye-closed"}
                                    onClick:appendInner={() => {
                                        showPassword.value = !showPassword.value;
                                    }}
                                    label={t("Password")}
                                    type={showPassword.value ? "text" : "password"}
                                    name="password"
                                    rules={[rules.required("Password"), rules.title("Password")]}
                                    modelValue={password.value}
                                    onUpdate:modelValue={(v) => {
                                        password.value = v;
                                    }}
                                ></TextField>
                            </ThemedView>
                        </VForm>

                        <Button
                            onClick={() => {
                                submit();
                            }}
                            color="primary"
                            variant="outlined"
                            loading={loading.value}
                            disabled={loading.value || !valid.value}
                        >
                            {t("Login")}
                        </Button>
                    </ThemedView>
                    <AlertView message={errMsg.value?.error} messages={errMsg.value?.errors} type="error"></AlertView>
                </ThemedView>
            </ThemedView>
        );
    };
});

export default LoginScreen;
