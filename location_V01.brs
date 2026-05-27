' location_V01.brs - BrightSign plugin for public IP and geolocation

Function Location_Initialize(msgPort As Object, userVariables As Object, bsp As Object)


    ' url = "https://ipinfo.io/json"
    ' transfer = CreateObject("roUrlTransfer")
    ' transfer.SetUrl(url)
    ' transfer.SetPort(msgPort)
    ' transfer.AsyncGetToString()

    return {
        objectName    : "location_object",
        msgPort       : msgPort,
        userVariables : userVariables,
        bsp           : bsp,
        systemLog     : CreateObject("roSystemLog"),
        myLocation     : "HOME",
        
       
        ProcessEvent: Function(event As Object)
        
            if type(event) = "roHtmlWidgetEvent" then

                payload = event.GetData()

                if payload <> invalid and type(payload) = "roAssociativeArray" then
                    if payload.reason = "load-finished" then

                    end if
                end if
            
            else if type(event) = "roStorageAttached" then

                m.systemLog.SendLine("------------------------- [LocationPlugin] Geolocation async request sent and delay 5 seconds")
                FetchLocation(m)
            else if type(event) = "roUrlEvent" then

                ' Verify this response belongs to our geolocation request
                if event.GetInt() = 1 then ' 1 means request completed successfully

                    response = event.GetString()
                    if response <> "" then
                        ' m.systemLog.SendLine("---------------- [LocationPlugin] response: " + response)
                        json = ParseJson(response)
                        json["location"] = m.myLocation
                        m.systemLog.SendLine("---------------- [LocationPlugin] response CITY: " + json.city)
                        m.systemLog.SendLine("---------------- [LocationPlugin] response LOCATION: " + json.location)
                    end if
                else
                    m.systemLog.SendLine("---------------- [LocationPlugin] Network request failed.")
                end if
             
            end if

            return false
        End Function
        
    }


End Function

' FetchLocation method (call as m.FetchLocation(m))
Sub FetchLocation(m as Object)

    sleep(5000)
    url = "https://ipinfo.io/json"
    m.transfer = CreateObject("roUrlTransfer")
    m.transfer.SetUrl(url)
    m.transfer.SetPort(m.msgPort)
    m.transfer.AsyncGetToString()
End Sub


