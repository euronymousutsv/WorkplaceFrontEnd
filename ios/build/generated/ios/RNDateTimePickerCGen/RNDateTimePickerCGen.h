/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleObjCpp
 *
 * We create an umbrella header (and corresponding implementation) here since
 * Cxx compilation in BUCK has a limitation: source-code producing genrule()s
 * must have a single output. More files => more genrule()s => slower builds.
 */

#ifndef __cplusplus
#error This file must be compiled as Obj-C++. If you are importing it, you must change your file extension to .mm.
#endif

// Avoid multiple includes of RNDateTimePickerCGen symbols
#ifndef RNDateTimePickerCGen_H
#define RNDateTimePickerCGen_H

#import <Foundation/Foundation.h>
#import <RCTRequired/RCTRequired.h>
#import <RCTTypeSafety/RCTConvertHelpers.h>
#import <RCTTypeSafety/RCTTypedModuleConstants.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTCxxConvert.h>
#import <React/RCTManagedPointer.h>
#import <ReactCommon/RCTTurboModule.h>
#import <optional>
#import <vector>

namespace JS {
  namespace NativeModuleDatePicker {
    struct SpecOpenParamsDialogButtons {
      NSString *string() const;

      SpecOpenParamsDialogButtons(NSDictionary *const v) : _v(v) {}
    private:
      NSDictionary *_v;
    };
  }
}

@interface RCTCxxConvert (NativeModuleDatePicker_SpecOpenParamsDialogButtons)
+ (RCTManagedPointer *)JS_NativeModuleDatePicker_SpecOpenParamsDialogButtons:(id)json;
@end
namespace JS {
  namespace NativeModuleDatePicker {
    struct SpecOpenParams {
      std::optional<JS::NativeModuleDatePicker::SpecOpenParamsDialogButtons> dialogButtons() const;
      NSString *display() const;
      std::optional<double> maximumDate() const;
      std::optional<double> minimumDate() const;
      NSString *testID() const;
      std::optional<double> timeZoneName() const;
      std::optional<double> timeZoneOffsetInMinutes() const;

      SpecOpenParams(NSDictionary *const v) : _v(v) {}
    private:
      NSDictionary *_v;
    };
  }
}

@interface RCTCxxConvert (NativeModuleDatePicker_SpecOpenParams)
+ (RCTManagedPointer *)JS_NativeModuleDatePicker_SpecOpenParams:(id)json;
@end
@protocol NativeModuleDatePickerSpec <RCTBridgeModule, RCTTurboModule>

- (void)dismiss:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject;
- (void)open:(JS::NativeModuleDatePicker::SpecOpenParams &)params
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject;

@end

@interface NativeModuleDatePickerSpecBase : NSObject {
@protected
facebook::react::EventEmitterCallback _eventEmitterCallback;
}
- (void)setEventEmitterCallback:(EventEmitterCallbackWrapper *)eventEmitterCallbackWrapper;


@end

namespace facebook::react {
  /**
   * ObjC++ class for module 'NativeModuleDatePicker'
   */
  class JSI_EXPORT NativeModuleDatePickerSpecJSI : public ObjCTurboModule {
  public:
    NativeModuleDatePickerSpecJSI(const ObjCTurboModule::InitParams &params);
  };
} // namespace facebook::react
namespace JS {
  namespace NativeModuleMaterialDatePicker {
    struct SpecOpenParamsDialogButtons {
      NSString *string() const;

      SpecOpenParamsDialogButtons(NSDictionary *const v) : _v(v) {}
    private:
      NSDictionary *_v;
    };
  }
}

@interface RCTCxxConvert (NativeModuleMaterialDatePicker_SpecOpenParamsDialogButtons)
+ (RCTManagedPointer *)JS_NativeModuleMaterialDatePicker_SpecOpenParamsDialogButtons:(id)json;
@end
namespace JS {
  namespace NativeModuleMaterialDatePicker {
    struct SpecOpenParams {
      std::optional<JS::NativeModuleMaterialDatePicker::SpecOpenParamsDialogButtons> dialogButtons() const;
      NSString *initialInputMode() const;
      NSString *title() const;
      std::optional<double> maximumDate() const;
      std::optional<double> minimumDate() const;
      std::optional<bool> fullscreen() const;
      NSString *testID() const;
      std::optional<double> timeZoneName() const;
      std::optional<double> timeZoneOffsetInMinutes() const;
      std::optional<double> firstDayOfWeek() const;

      SpecOpenParams(NSDictionary *const v) : _v(v) {}
    private:
      NSDictionary *_v;
    };
  }
}

@interface RCTCxxConvert (NativeModuleMaterialDatePicker_SpecOpenParams)
+ (RCTManagedPointer *)JS_NativeModuleMaterialDatePicker_SpecOpenParams:(id)json;
@end
@protocol NativeModuleMaterialDatePickerSpec <RCTBridgeModule, RCTTurboModule>

- (void)dismiss:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject;
- (void)open:(JS::NativeModuleMaterialDatePicker::SpecOpenParams &)params
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject;

@end

@interface NativeModuleMaterialDatePickerSpecBase : NSObject {
@protected
facebook::react::EventEmitterCallback _eventEmitterCallback;
}
- (void)setEventEmitterCallback:(EventEmitterCallbackWrapper *)eventEmitterCallbackWrapper;


@end

namespace facebook::react {
  /**
   * ObjC++ class for module 'NativeModuleMaterialDatePicker'
   */
  class JSI_EXPORT NativeModuleMaterialDatePickerSpecJSI : public ObjCTurboModule {
  public:
    NativeModuleMaterialDatePickerSpecJSI(const ObjCTurboModule::InitParams &params);
  };
} // namespace facebook::react
namespace JS {
  namespace NativeModuleMaterialTimePicker {
    struct SpecOpenParamsDialogButtons {
      NSString *string() const;

      SpecOpenParamsDialogButtons(NSDictionary *const v) : _v(v) {}
    private:
      NSDictionary *_v;
    };
  }
}

@interface RCTCxxConvert (NativeModuleMaterialTimePicker_SpecOpenParamsDialogButtons)
+ (RCTManagedPointer *)JS_NativeModuleMaterialTimePicker_SpecOpenParamsDialogButtons:(id)json;
@end
namespace JS {
  namespace NativeModuleMaterialTimePicker {
    struct SpecOpenParams {
      std::optional<JS::NativeModuleMaterialTimePicker::SpecOpenParamsDialogButtons> dialogButtons() const;
      NSString *initialInputMode() const;
      NSString *title() const;
      std::optional<bool> is24Hour() const;
      std::optional<double> timeZoneOffsetInMinutes() const;

      SpecOpenParams(NSDictionary *const v) : _v(v) {}
    private:
      NSDictionary *_v;
    };
  }
}

@interface RCTCxxConvert (NativeModuleMaterialTimePicker_SpecOpenParams)
+ (RCTManagedPointer *)JS_NativeModuleMaterialTimePicker_SpecOpenParams:(id)json;
@end
@protocol NativeModuleMaterialTimePickerSpec <RCTBridgeModule, RCTTurboModule>

- (void)dismiss:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject;
- (void)open:(JS::NativeModuleMaterialTimePicker::SpecOpenParams &)params
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject;

@end

@interface NativeModuleMaterialTimePickerSpecBase : NSObject {
@protected
facebook::react::EventEmitterCallback _eventEmitterCallback;
}
- (void)setEventEmitterCallback:(EventEmitterCallbackWrapper *)eventEmitterCallbackWrapper;


@end

namespace facebook::react {
  /**
   * ObjC++ class for module 'NativeModuleMaterialTimePicker'
   */
  class JSI_EXPORT NativeModuleMaterialTimePickerSpecJSI : public ObjCTurboModule {
  public:
    NativeModuleMaterialTimePickerSpecJSI(const ObjCTurboModule::InitParams &params);
  };
} // namespace facebook::react
namespace JS {
  namespace NativeModuleTimePicker {
    struct SpecOpenParamsDialogButtons {
      NSString *string() const;

      SpecOpenParamsDialogButtons(NSDictionary *const v) : _v(v) {}
    private:
      NSDictionary *_v;
    };
  }
}

@interface RCTCxxConvert (NativeModuleTimePicker_SpecOpenParamsDialogButtons)
+ (RCTManagedPointer *)JS_NativeModuleTimePicker_SpecOpenParamsDialogButtons:(id)json;
@end
namespace JS {
  namespace NativeModuleTimePicker {
    struct SpecOpenParams {
      std::optional<JS::NativeModuleTimePicker::SpecOpenParamsDialogButtons> dialogButtons() const;
      NSString *display() const;
      std::optional<bool> is24Hour() const;
      std::optional<double> minuteInterval() const;
      std::optional<double> timeZoneOffsetInMinutes() const;

      SpecOpenParams(NSDictionary *const v) : _v(v) {}
    private:
      NSDictionary *_v;
    };
  }
}

@interface RCTCxxConvert (NativeModuleTimePicker_SpecOpenParams)
+ (RCTManagedPointer *)JS_NativeModuleTimePicker_SpecOpenParams:(id)json;
@end
@protocol NativeModuleTimePickerSpec <RCTBridgeModule, RCTTurboModule>

- (void)dismiss:(RCTPromiseResolveBlock)resolve
         reject:(RCTPromiseRejectBlock)reject;
- (void)open:(JS::NativeModuleTimePicker::SpecOpenParams &)params
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject;

@end

@interface NativeModuleTimePickerSpecBase : NSObject {
@protected
facebook::react::EventEmitterCallback _eventEmitterCallback;
}
- (void)setEventEmitterCallback:(EventEmitterCallbackWrapper *)eventEmitterCallbackWrapper;


@end

namespace facebook::react {
  /**
   * ObjC++ class for module 'NativeModuleTimePicker'
   */
  class JSI_EXPORT NativeModuleTimePickerSpecJSI : public ObjCTurboModule {
  public:
    NativeModuleTimePickerSpecJSI(const ObjCTurboModule::InitParams &params);
  };
} // namespace facebook::react
inline NSString *JS::NativeModuleDatePicker::SpecOpenParamsDialogButtons::string() const
{
  id const p = _v[@"string"];
  return RCTBridgingToString(p);
}
inline std::optional<JS::NativeModuleDatePicker::SpecOpenParamsDialogButtons> JS::NativeModuleDatePicker::SpecOpenParams::dialogButtons() const
{
  id const p = _v[@"dialogButtons"];
  return (p == nil ? std::nullopt : std::make_optional(JS::NativeModuleDatePicker::SpecOpenParamsDialogButtons(p)));
}
inline NSString *JS::NativeModuleDatePicker::SpecOpenParams::display() const
{
  id const p = _v[@"display"];
  return RCTBridgingToOptionalString(p);
}
inline std::optional<double> JS::NativeModuleDatePicker::SpecOpenParams::maximumDate() const
{
  id const p = _v[@"maximumDate"];
  return RCTBridgingToOptionalDouble(p);
}
inline std::optional<double> JS::NativeModuleDatePicker::SpecOpenParams::minimumDate() const
{
  id const p = _v[@"minimumDate"];
  return RCTBridgingToOptionalDouble(p);
}
inline NSString *JS::NativeModuleDatePicker::SpecOpenParams::testID() const
{
  id const p = _v[@"testID"];
  return RCTBridgingToOptionalString(p);
}
inline std::optional<double> JS::NativeModuleDatePicker::SpecOpenParams::timeZoneName() const
{
  id const p = _v[@"timeZoneName"];
  return RCTBridgingToOptionalDouble(p);
}
inline std::optional<double> JS::NativeModuleDatePicker::SpecOpenParams::timeZoneOffsetInMinutes() const
{
  id const p = _v[@"timeZoneOffsetInMinutes"];
  return RCTBridgingToOptionalDouble(p);
}
inline NSString *JS::NativeModuleMaterialDatePicker::SpecOpenParamsDialogButtons::string() const
{
  id const p = _v[@"string"];
  return RCTBridgingToString(p);
}
inline std::optional<JS::NativeModuleMaterialDatePicker::SpecOpenParamsDialogButtons> JS::NativeModuleMaterialDatePicker::SpecOpenParams::dialogButtons() const
{
  id const p = _v[@"dialogButtons"];
  return (p == nil ? std::nullopt : std::make_optional(JS::NativeModuleMaterialDatePicker::SpecOpenParamsDialogButtons(p)));
}
inline NSString *JS::NativeModuleMaterialDatePicker::SpecOpenParams::initialInputMode() const
{
  id const p = _v[@"initialInputMode"];
  return RCTBridgingToOptionalString(p);
}
inline NSString *JS::NativeModuleMaterialDatePicker::SpecOpenParams::title() const
{
  id const p = _v[@"title"];
  return RCTBridgingToOptionalString(p);
}
inline std::optional<double> JS::NativeModuleMaterialDatePicker::SpecOpenParams::maximumDate() const
{
  id const p = _v[@"maximumDate"];
  return RCTBridgingToOptionalDouble(p);
}
inline std::optional<double> JS::NativeModuleMaterialDatePicker::SpecOpenParams::minimumDate() const
{
  id const p = _v[@"minimumDate"];
  return RCTBridgingToOptionalDouble(p);
}
inline std::optional<bool> JS::NativeModuleMaterialDatePicker::SpecOpenParams::fullscreen() const
{
  id const p = _v[@"fullscreen"];
  return RCTBridgingToOptionalBool(p);
}
inline NSString *JS::NativeModuleMaterialDatePicker::SpecOpenParams::testID() const
{
  id const p = _v[@"testID"];
  return RCTBridgingToOptionalString(p);
}
inline std::optional<double> JS::NativeModuleMaterialDatePicker::SpecOpenParams::timeZoneName() const
{
  id const p = _v[@"timeZoneName"];
  return RCTBridgingToOptionalDouble(p);
}
inline std::optional<double> JS::NativeModuleMaterialDatePicker::SpecOpenParams::timeZoneOffsetInMinutes() const
{
  id const p = _v[@"timeZoneOffsetInMinutes"];
  return RCTBridgingToOptionalDouble(p);
}
inline std::optional<double> JS::NativeModuleMaterialDatePicker::SpecOpenParams::firstDayOfWeek() const
{
  id const p = _v[@"firstDayOfWeek"];
  return RCTBridgingToOptionalDouble(p);
}
inline NSString *JS::NativeModuleMaterialTimePicker::SpecOpenParamsDialogButtons::string() const
{
  id const p = _v[@"string"];
  return RCTBridgingToString(p);
}
inline std::optional<JS::NativeModuleMaterialTimePicker::SpecOpenParamsDialogButtons> JS::NativeModuleMaterialTimePicker::SpecOpenParams::dialogButtons() const
{
  id const p = _v[@"dialogButtons"];
  return (p == nil ? std::nullopt : std::make_optional(JS::NativeModuleMaterialTimePicker::SpecOpenParamsDialogButtons(p)));
}
inline NSString *JS::NativeModuleMaterialTimePicker::SpecOpenParams::initialInputMode() const
{
  id const p = _v[@"initialInputMode"];
  return RCTBridgingToOptionalString(p);
}
inline NSString *JS::NativeModuleMaterialTimePicker::SpecOpenParams::title() const
{
  id const p = _v[@"title"];
  return RCTBridgingToOptionalString(p);
}
inline std::optional<bool> JS::NativeModuleMaterialTimePicker::SpecOpenParams::is24Hour() const
{
  id const p = _v[@"is24Hour"];
  return RCTBridgingToOptionalBool(p);
}
inline std::optional<double> JS::NativeModuleMaterialTimePicker::SpecOpenParams::timeZoneOffsetInMinutes() const
{
  id const p = _v[@"timeZoneOffsetInMinutes"];
  return RCTBridgingToOptionalDouble(p);
}
inline NSString *JS::NativeModuleTimePicker::SpecOpenParamsDialogButtons::string() const
{
  id const p = _v[@"string"];
  return RCTBridgingToString(p);
}
inline std::optional<JS::NativeModuleTimePicker::SpecOpenParamsDialogButtons> JS::NativeModuleTimePicker::SpecOpenParams::dialogButtons() const
{
  id const p = _v[@"dialogButtons"];
  return (p == nil ? std::nullopt : std::make_optional(JS::NativeModuleTimePicker::SpecOpenParamsDialogButtons(p)));
}
inline NSString *JS::NativeModuleTimePicker::SpecOpenParams::display() const
{
  id const p = _v[@"display"];
  return RCTBridgingToOptionalString(p);
}
inline std::optional<bool> JS::NativeModuleTimePicker::SpecOpenParams::is24Hour() const
{
  id const p = _v[@"is24Hour"];
  return RCTBridgingToOptionalBool(p);
}
inline std::optional<double> JS::NativeModuleTimePicker::SpecOpenParams::minuteInterval() const
{
  id const p = _v[@"minuteInterval"];
  return RCTBridgingToOptionalDouble(p);
}
inline std::optional<double> JS::NativeModuleTimePicker::SpecOpenParams::timeZoneOffsetInMinutes() const
{
  id const p = _v[@"timeZoneOffsetInMinutes"];
  return RCTBridgingToOptionalDouble(p);
}
#endif // RNDateTimePickerCGen_H
