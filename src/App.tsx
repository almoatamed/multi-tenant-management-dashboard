import "./styles/globals/app.scss";

import { RouterView } from "vue-router";

import { dc } from "kt-dc";
import { confirmDialogInstance } from "./utils/confirm";
import { AwaitedConfirmationDialog } from "./components/ConfirmDialog";
import { snackBarInstance } from "./utils/snackBar";
import { VApp } from "vuetify/components";
import { useTheme } from "vuetify";
import { SnackBar } from "@/components/SnackBar/index";
import { DetailsFieldsDialog } from "./components/detailsFieldsDialog";
import { detailsDialogRef } from "./utils/showDetails/idnex";
const App = dc(() => {

    return () => {
        return (
            <VApp
                style={{
                    height: "100%",
                    width: "100%",
                }}
            >
                <AwaitedConfirmationDialog
                    ref={(r) => {
                        confirmDialogInstance.value = r as any;
                    }}
                ></AwaitedConfirmationDialog>
                <DetailsFieldsDialog
                    ref={(r) => {
                        detailsDialogRef.value = r as any;
                    }}
                ></DetailsFieldsDialog>
                <SnackBar
                    ref={(r) => {
                        snackBarInstance.value = r as any;
                    }}
                ></SnackBar>

                <RouterView />
            </VApp>
        );
    };
});

export default App;
