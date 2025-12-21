import { ThemedView } from "@/components/ThemedView";
import router from "@/router";
import { drawer, toggleDrawer } from "@/state/app/index";
import {
    VAppBar,
    VCard,
    VCardText,
    VIcon,
    VLayout,
    VList,
    VListGroup,
    VListItem,
    VMain,
    VMenu,
    VNavigationDrawer,
    VProgressCircular,
} from "vuetify/components";
// import AppBarLogoSvg from "@/assets/images/logo_blue.png";
import { useLocale, useTheme } from "vuetify";
import { loggingOut, logout, user} from "@/state/user";
import { useSections } from "./sections";
import { setLocale } from "@/plugins/localization";
import { isDev } from "@/constants/env";

type Menu = MenuItem[];

type MenuItem =
    | {
          label: string;
          icon?: string;
          type?: undefined;
          action: () => void | Promise<void>;
      }
    | {
          type: "menu";
          label: string;
          icon?: string;
          subMenu: Menu;
      };

const AccountActions = defineComponent(() => {
    const local = useLocale();

    return () => {
        const { t } = local;
        const accountActions: Menu = [
            {
                action() {
                    console.log("[LOGOUT] from default layout because user pressed it");

                    logout();
                },
                icon: "mdi-logout",
                label: t("Logout"),
            },
            {
                label: t("Language"),
                type: "menu",
                icon: "mdi-translate",
                subMenu: [
                    {
                        label: "العربية",
                        action: () => {
                            setLocale("ar");
                            // local.current.value = "ar";
                            // setTimeout(() => {
                            //     location.reload();
                            // }, 0.8e3);
                        },
                    },
                    {
                        label: "English",
                        action: () => {
                            setLocale("en");
                        },
                    },
                ],
            },
        ];
        return (
            <ThemedView
                style={{
                    gap: "12px",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flex: 1,
                }}
            >
                <ThemedView>
                    <ThemedView
                        style={{
                            cursor: "pointer",
                            flexDirection: "row",
                            alignItems: "center",
                            borderRadius: "12px",
                            padding: "4px 12px",
                            gap: "12px",
                            minWidth: "150px",
                        }}
                        class={"hoverable"}
                        id="account-actions"
                    >
                        <VIcon size={22} icon={"mdi-account-circle"}></VIcon>
                        <span>{user.value?.userInfo?.username || "User"}</span>
                    </ThemedView>

                    <VMenu activator="#account-actions">
                        {{
                            default: () => {
                                return (
                                    <>
                                        <VList minWidth={"250px"} density={"compact"}>
                                            {accountActions.map((action, index) => {
                                                return <MenuItem key={String(index)} item={action}></MenuItem>;
                                            })}
                                        </VList>
                                    </>
                                );
                            },
                        }}
                    </VMenu>
                </ThemedView>
            </ThemedView>
        );
    };
});

const MenuItem = defineComponent(
    (props: { item: MenuItem }) => {
        const item = props.item;

        return () => {
            if (item.type === undefined) {
                return (
                    <VListItem onClick={item.action}>
                        <VListItem title={item.label} appendIcon={item.icon}></VListItem>
                    </VListItem>
                );
            }
            if (item.type == "menu") {
                return (
                    <VMenu submenu>
                        {{
                            activator: ({ props }: { props: any }) => {
                                return (
                                    <>
                                        <VListItem {...props}>
                                            <VListItem title={item.label} appendIcon={item.icon}></VListItem>
                                        </VListItem>
                                    </>
                                );
                            },
                            default: () => {
                                return (
                                    <>
                                        <VList minWidth={"250px"} density={"compact"}>
                                            {item.subMenu.map((action, index) => {
                                                return <MenuItem key={String(index)} item={action}></MenuItem>;
                                            })}
                                        </VList>
                                    </>
                                );
                            },
                        }}
                    </VMenu>
                );
            }
        };
    },
    {
        props: ["item"],
    },
);

const AppBarLogo = defineComponent(() => {
    const {t} = useLocale();
    return () => {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                }}
            >
                <ThemedView onClick={() => toggleDrawer()} style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    border: "1px solid",
                    borderRadius: "12px",
                    padding: "6px",
                }}>
                    {t("Toggle Drawer")}
                    {/* <img height="60px" src={AppBarLogoSvg} /> */}
                    <VIcon>mdi-export</VIcon>
                </ThemedView>
            </div>
        );
    };
});

const AppBar = defineComponent(() => {
    return () => {
        return (
            <>
                <VAppBar class="elevation-0 border-b">
                    <ThemedView
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                            padding: "12px 22px",
                            gap: "80px",
                            background: "#ffffff",
                            borderBottom: "solid 1px #e5e5e9",
                        }}
                    >
                        <AppBarLogo></AppBarLogo>

                        <AccountActions />
                    </ThemedView>
                </VAppBar>
            </>
        );
    };
});

const RoutesList = defineComponent(() => {
    const theme = useTheme();
    const sections = useSections();
    const { t } = useLocale();
    return () => {
        return (
            <VList
                style={{
                    padding: "18px 12px",
                    overflowY: "auto",
                }}
                class={"bg-background"}
                density={"compact"}
            >
                {sections.map((section) => {
                    const routes = section.routes;
                    return (
                        <ThemedView
                            key={section.title}
                            style={{
                                gap: "8px",
                                paddingBottom: "18px",
                            }}
                        >
                            <VListGroup value={section.title}>
                                {{
                                    activator: ({ props }: any) => {
                                        return (
                                            <VListItem
                                                {...props}
                                                style={{
                                                    width: "100%",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        opacity: "0.5",
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    {t(section.title)}
                                                </span>
                                            </VListItem>
                                        );
                                    },
                                    default: () => {
                                        return (
                                            <ThemedView
                                                style={{
                                                    gap: "12px",
                                                    padding: "12px 0px",
                                                }}
                                            >
                                                {routes.map((r) => {
                                                    const isFocused = router.currentRoute.value?.name == r.name;
                                                    return (
                                                        <VListItem
                                                            prependIcon={r.icon}
                                                            disabled={isFocused}
                                                            key={r.name}
                                                            style={{
                                                                borderInlineEnd: isFocused
                                                                    ? `solid 5px ${theme.current.value.colors.primary + "dd"}`
                                                                    : undefined,

                                                                backgroundColor: isFocused ? theme.current.value.colors.primary + "66" : undefined,
                                                                borderRadius: "12px",
                                                            }}
                                                            onClick={() => {
                                                                if (isFocused) {
                                                                    return;
                                                                }
                                                                router.push({
                                                                    name: r.name,
                                                                });
                                                            }}
                                                            class={isFocused ? "rounded-lg" : ""}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontWeight: "600",
                                                                    fontSize: "14px",
                                                                    letterSpacing: "1px",
                                                                    color: theme.current.value.colors.primary,
                                                                }}
                                                            >
                                                                {String(t(r.label)).toUpperCase()}
                                                            </span>
                                                        </VListItem>
                                                    );
                                                })}
                                            </ThemedView>
                                        );
                                    },
                                }}
                            </VListGroup>
                        </ThemedView>
                    );
                })}
            </VList>
        );
    };
});

const Drawer = defineComponent(() => {
    return () => {
        const content = (
            <>
                <ThemedView
                    style={{
                        gap: "12px",
                        minHeight: "100%",
                        overflowY: "auto",
                    }}
                >
                    <VCard
                        style={{
                            overflow: "hidden",
                            flex: 1,
                        }}
                        class={`bg-background rounded-0 border-none`}
                    >
                        <VCardText
                            style={{
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                flex: "1",
                            }}
                            class="pa-0 bg-background"
                        >
                            <RoutesList></RoutesList>
                        </VCardText>
                    </VCard>
                </ThemedView>
            </>
        );

        return (
            <>
                <VNavigationDrawer
                    modelValue={drawer.value}
                    onUpdate:modelValue={(v) => {
                        drawer.value = v;
                    }}
                    width={350}
                    color="grey-lighten-3  hide-scroll-bar elevation-0"
                >
                    {content}
                </VNavigationDrawer>
            </>
        );
    };
});

const DashboardLayout = defineComponent<{}>(() => {
    const { t } = useLocale();

    const loadingUser = ref(false);

    const checkUser = async () => {
        console.log("USER", user.value?.userInfo);
        await nextTick();
        if (!user.value?.token || !user.value?.userInfo) {
            console.log("[LOGOUT] default layout user has no token or user info");
            logout();
            return;
        }
    };

    onMounted(() => {
        checkUser();
    });

    const hideDrawer = computed((): boolean => {
        return loadingUser.value || loggingOut.value;
    });

    return () => {
        if (loggingOut.value) {
            return (
                <ThemedView
                    style={{
                        width: "100%",
                        height: "100%",
                        padding: "12px",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                    }}
                >
                    <ThemedView>{t("Logging Out")}</ThemedView>
                    <ThemedView>
                        <VProgressCircular indeterminate size={32}></VProgressCircular>
                    </ThemedView>
                </ThemedView>
            );
        }

        if (loadingUser.value) {
            return (
                <ThemedView
                    style={{
                        width: "100%",
                        height: "100%",
                        padding: "12px",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                    }}
                >
                    <ThemedView>{t("Loading User")}</ThemedView>
                    <ThemedView>
                        <VProgressCircular indeterminate size={32}></VProgressCircular>
                    </ThemedView>
                </ThemedView>
            );
        }

        let mainView = <router-view />;

        const main = (
            <VMain
                style={{
                    overflowY: "auto",
                }}
            >
                {mainView}
            </VMain>
        );

        return (
            <VLayout
                style={{
                    width: "100%",
                    background: "#f7f7f6",
                }}
            >
                <AppBar></AppBar>

                {!hideDrawer.value && <Drawer />}

                {main}
            </VLayout>
        );
    };
});

export default DashboardLayout;
