import {
    CardStyleInterpolators,
    TransitionPresets,
} from "@react-navigation/stack";

const transitionSpec = {
  animation: "timing" as const,
  config: {
    duration: 340,
  },
};

export const ForwardExpandTransition = {
  ...TransitionPresets.SlideFromRightIOS,
  transitionSpec: {
    open: transitionSpec,
    close: transitionSpec,
  },
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export const BackwardGracefulTransition = {
  ...TransitionPresets.SlideFromLeftIOS,
  transitionSpec: {
    open: transitionSpec,
    close: transitionSpec,
  },
  cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
};

export const LateralCrossfadeTransition = {
  ...TransitionPresets.DefaultTransition,
  transitionSpec: {
    open: transitionSpec,
    close: transitionSpec,
  },
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
};

export const ModalSlideUpTransition = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
};

export const FocusModeFadeTransition = {
  ...TransitionPresets.FadeFromBottomAndroid,
};

export const SwipeBackTransition = {
  gestureEnabled: true,
  gestureDirection: "horizontal" as const,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};
