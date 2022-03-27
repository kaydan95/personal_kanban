import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        titleColor : string;
        textColor : string;
        bgColor : string;
        cardColor : string;
        accentColor : string;
        upColor : string;
        downColor : string;
    }
}