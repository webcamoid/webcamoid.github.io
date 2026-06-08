import QtQuick
import QtQuick.Layouts
import Qt5Compat.GraphicalEffects

Item {
    id: downloadButton
    width: 256 * downloadButton.scale
    height: 256 * downloadButton.scale

    property string appName: "Webcamoid"
    property real scale: 2.0
    property int stripeWidth: 3 * downloadButton.scale
    property int textPointSize: 12 * downloadButton.scale
    property int iconSize: 48 * downloadButton.scale
/**
    property color stripeColor: Qt.rgba(0, 0.66, 0.33)
    property string buttonIcon: "android.svg"
    property string deviceIcon: "phone.svg"
    property string buttonText: "Android"
    property string architecture: ""
//*/
/**/
    property color stripeColor: Qt.rgba(0.25, 0.16, 0.5)
    property string buttonIcon: "linux.svg"
    property string deviceIcon: architecture == "x86_64"? "laptop.svg": "raspberry.svg"
    property string buttonText: "Linux"
    //property string architecture: "x86_64"
    //property string architecture: "ARM 64"
    property string architecture: "ARM 32"
//*/
/**
    property color stripeColor: Qt.rgba(0, 0.33, 0.66)
    property string buttonIcon: "windows.svg"
    property string deviceIcon: "laptop.svg"
    property string buttonText: "Windows"
    property string architecture: ""
//*/
    Item {
        id: buttonStripes
        anchors.fill: parent

        function brightness(color, b) {
            return Qt.rgba(color.r * b, color.g * b, color.b * b, color.a)
        }

        Row {
            Repeater {
                model: Math.round(buttonStripes.width / downloadButton.stripeWidth)

                Row {
                    Rectangle {
                        width: downloadButton.stripeWidth
                        height: buttonStripes.height
                        color: downloadButton.stripeColor
                    }
                    Rectangle {
                        width: downloadButton.stripeWidth
                        height: buttonStripes.height
                        color: buttonStripes.brightness(downloadButton.stripeColor, 0.5)
                    }
                }
            }
        }

        transform: [
            Rotation {
                origin.x: width / 2
                origin.y: height / 2
                axis {
                    x: 0
                    y: 0
                    z: 1

                }
                angle: -45
            },
            Scale {
                origin.x: width / 2
                origin.y: height / 2
                xScale: 3
                yScale: 3
            }
        ]
    }
    RadialGradient {
        x: parent.width - parent.height
        width: parent.height
        height: parent.height
        horizontalOffset: width / 2
        verticalOffset: height / 2
        opacity: 0.25
        gradient: Gradient {
            GradientStop { position: 0.0; color: "white" }
            GradientStop { position: 1; color: "transparent" }
        }
    }
    Rectangle {
        id: rect
        width: parent.width + radius / 2
        height: parent.height + radius / 2
        anchors.centerIn: parent
        color: Qt.rgba(0, 0, 0, 0)
        radius: 32 * downloadButton.scale
        border.color: Qt.rgba(0, 0, 0, 1)
        border.width: radius / 2
        smooth: true
    }
    ShaderEffectSource {
        id: blurSource
        width: parent.width + rect.radius / 2
        height: parent.height + rect.radius / 2
        anchors.centerIn: parent
        format: ShaderEffectSource.RGBA8
        hideSource: true
        sourceItem: rect
        live: true
        visible: false
    }
    FastBlur {
        width: parent.width + rect.radius / 2
        height: parent.height + rect.radius / 2
        anchors.centerIn: parent
        source: blurSource
        transparentBorder: true
        radius: 32 * downloadButton.scale
        opacity: 0.8
    }
    GridLayout {
        anchors.centerIn: parent
        columns: 3
        rowSpacing: 8 * downloadButton.scale
        columnSpacing: 8 * downloadButton.scale

        Image {
            source: "webcamoid.svg"
            width: downloadButton.iconSize
            height: width
            smooth: true
            mipmap: true
            fillMode: Image.PreserveAspectFit
            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
            Layout.preferredWidth: width
            Layout.preferredHeight: height
        }
        Image {
            id: device
            source: downloadButton.deviceIcon
            width: downloadButton.iconSize
            height: width
            smooth: true
            mipmap: true
            visible: false
            fillMode: Image.PreserveAspectFit
            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
            Layout.preferredWidth: width
            Layout.preferredHeight: height
        }
        HueSaturation {
            source: device
            width: downloadButton.iconSize
            height: width
            saturation: 0.0
            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
            Layout.preferredWidth: downloadButton.iconSize
            Layout.preferredHeight: downloadButton.iconSize
        }
        Image {
            source: downloadButton.buttonIcon
            width: downloadButton.iconSize
            height: width
            smooth: true
            mipmap: true
            fillMode: Image.PreserveAspectFit
            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
            Layout.preferredWidth: width
            Layout.preferredHeight: height
        }
        Text {
            text: downloadButton.appName
            font.pointSize: downloadButton.textPointSize
            font.bold: true
            color: "white"
            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
        }
        Text {
            text: qsTr("for")
            font.pointSize: downloadButton.textPointSize
            font.bold: true
            color: "white"
            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
        }
        Text {
            text: downloadButton.buttonText
            font.pointSize: downloadButton.textPointSize
            font.bold: true
            color: "white"
            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
        }
        Text {
            text: qsTr("Camera capture application")
            font.pointSize: downloadButton.textPointSize
            //font.bold: true
            color: "white"
            Layout.alignment: Qt.AlignHCenter | Qt.AlignVCenter
            Layout.columnSpan: 3
        }
    }
    Rectangle {
        color: "red"
        width: 64 * downloadButton.scale
        height: 32 * downloadButton.scale
        radius: 8 * downloadButton.scale
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        anchors.rightMargin: 16 * downloadButton.scale
        anchors.bottomMargin: 16 * downloadButton.scale
        visible: downloadButton.architecture.length > 0

        Text {
            text: downloadButton.architecture
            anchors.centerIn: parent
            font.pointSize: 0.75 * downloadButton.textPointSize
            font.bold: true
            color: "white"
        }
    }
}
