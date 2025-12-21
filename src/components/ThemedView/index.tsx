import { defineComponent, type HTMLAttributes, type ReservedProps } from "vue";

export const ThemedView = defineComponent<
    HTMLAttributes &
        ReservedProps & {
            disabled?: boolean;
        }
>(
    (p, { attrs, slots }) => {
        return () => {
            const props = attrs as HTMLAttributes & ReservedProps;
            return (
                <div
                    {...props}
                    style={[
                        {
                            display: "flex",
                            flexDirection: "column",
                            cursor:
                                props.onClick && !p.disabled
                                    ? "pointer"
                                    : undefined,
                        },
                        props.style,
                    ]}
                    onClick={p.disabled ? undefined : props.onClick}
                >
                    {slots.default?.()}
                </div>
            );
        };
    },
    {
        slots: ["default"],
        props: ["disabled"],
    },
);
export default ThemedView;
